from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import CommitSerializer, GroupSerializer
from userauth.serializers import UserInfoSerializer
from .models import Commit, Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.db.models import Count
from datetime import timedelta,date

# Create your views here.

def calculate_streak(querysets):
    today=date.today()
    current_streak = 0
    for queryset in reversed(querysets):
        if queryset['date'] == today -timedelta(days=current_streak):
            current_streak += 1
        else:
            break
    return current_streak

class CommitView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        queryset = Commit.objects.filter(user=user).order_by('date')
        streakset = Commit.objects.filter(user=user).order_by('date').values('date').distinct()
        serializer = CommitSerializer(queryset, many=True)
        streak = calculate_streak(streakset)
        data={
            'data':serializer.data,
            'streak':streak
        }
        return Response(data)
    
    def post(self,request):
        data=request.data
        user=request.user
        # data["user"]= request.user
        serializer = CommitSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            commit_instance = serializer.save(user=user)#yo garena vane not null fail hunxa cause u need to provide user to model in order to save a new 
            if data["type"] == "Group":
            # Add this commit to all related groups
                if data["group_code"]:
                    group = Group.objects.filter(user=user, code=data["group_code"]).first()
                    group.commit.add(commit_instance)#you need to pass an object instance here instead of the serialized data
            return Response({"msg":serializer.data},status=status.HTTP_200_OK)
        
# class CreateGroupView(APIView)
        
class GroupView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        queryset = Group.objects.filter(user=user)
        if queryset:
            group_data=[]
            for group in queryset:
                if group:
                    userstreaks=[]
                    for user in group.user.all():
                        streakset = Commit.objects.filter(user=user,type="Group").order_by('date').values('date').distinct()
                        userstreaks.append(calculate_streak(streakset))
                    streak = min(userstreaks)
                    serializer = GroupSerializer(group)
                    group_data.append({'data': serializer.data, 'streak': streak})
            return Response(group_data)
        else:
            return Response({'error': "No matching group found for the user"}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self,request):
        action = request.data.get('action')
        if action == "create":
            return self.create_group(request)
        elif action == "join":
            return self.join_group(request)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def create_group(self,request):
        data=request.data
        user=request.user
        data.pop('action',None)
        serializer=GroupSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=[user])#we need to send a list here because models has manytomany field so it is gonna expect a list. Also we can just do serializer.save and it is gonna save it without adding any users
            print("Group created")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def join_group(self,request):
        data = request.data
        user = request.user
        data.pop('action',None)
        join_code = data.pop('join_code',None)
        group=Group.objects.get(code=join_code)
        print(group.user.all())
        if user in group.user.all():
            return Response({'msg':"User already exists ini group"},status=status.HTTP_400_BAD_REQUEST)
        else:
            group.user.add(user)
        return Response({'msg':"User added succesfully"},status=status.HTTP_200_OK)