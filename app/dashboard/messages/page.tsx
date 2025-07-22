'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Send, 
  MessageSquare, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Star,
  Archive
} from 'lucide-react';

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      participants: ['Sarah Johnson', 'HR Manager - Google'],
      lastMessage: 'Thank you for the interview opportunity. I look forward to hearing from you.',
      timestamp: '2024-01-22 14:30',
      unread: true,
      type: 'application',
      status: 'active',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 2,
      participants: ['Michael Chen', 'Recruiter - Meta'],
      lastMessage: 'Could you please provide more details about the technical requirements?',
      timestamp: '2024-01-22 12:15',
      unread: false,
      type: 'inquiry',
      status: 'resolved',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 3,
      participants: ['Emma Davis', 'Team Lead - Apple'],
      lastMessage: 'I am excited to start the internship next month. What should I prepare?',
      timestamp: '2024-01-22 10:45',
      unread: true,
      type: 'onboarding',
      status: 'active',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 4,
      participants: ['Tech Corp', 'Platform Support'],
      lastMessage: 'We need help with updating our company profile and job postings.',
      timestamp: '2024-01-22 09:20',
      unread: false,
      type: 'support',
      status: 'pending',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 5,
      participants: ['David Wilson', 'Admin Team'],
      lastMessage: 'I think there might be an issue with my application submission.',
      timestamp: '2024-01-21 16:30',
      unread: true,
      type: 'technical',
      status: 'urgent',
      avatar: '/placeholder-avatar.jpg'
    }
  ];

  const messageStats = {
    total: conversations.length,
    unread: conversations.filter(c => c.unread).length,
    active: conversations.filter(c => c.status === 'active').length,
    urgent: conversations.filter(c => c.status === 'urgent').length,
    resolved: conversations.filter(c => c.status === 'resolved').length
  };

  const sampleMessages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hello! I just wanted to follow up on my application for the Software Engineering Intern position.',
      timestamp: '2024-01-22 14:00',
      isFromUser: true
    },
    {
      id: 2,
      sender: 'Admin Support',
      message: 'Hi Sarah! Thank you for your follow-up. We have received your application and it is currently under review by our team.',
      timestamp: '2024-01-22 14:15',
      isFromUser: false
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'Thank you for the update! Is there any additional information I can provide to support my application?',
      timestamp: '2024-01-22 14:20',
      isFromUser: true
    },
    {
      id: 4,
      sender: 'Admin Support',
      message: 'Your application looks comprehensive. We will be in touch within the next week with next steps.',
      timestamp: '2024-01-22 14:25',
      isFromUser: false
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      message: 'Thank you for the interview opportunity. I look forward to hearing from you.',
      timestamp: '2024-01-22 14:30',
      isFromUser: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'urgent': return <AlertCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Center</h1>
          <p className="text-sm text-gray-600">Manage platform communications and support</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{messageStats.total}</p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{messageStats.unread}</p>
              <p className="text-sm text-gray-600">Unread Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{messageStats.active}</p>
              <p className="text-sm text-gray-600">Active Conversations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{messageStats.urgent}</p>
              <p className="text-sm text-gray-600">Urgent Issues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{messageStats.resolved}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Recent messages and inquiries</CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} alt="User" />
                      <AvatarFallback>{conversation.participants[0][0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participants.join(' & ')}
                        </p>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {conversation.type}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {getStatusIcon(conversation.status)}
                          <span className="ml-1">{conversation.status}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Message Thread</CardTitle>
                <CardDescription>
                  {selectedConversation ? 'Active conversation' : 'Select a conversation to view messages'}
                </CardDescription>
              </div>
              {selectedConversation && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Star
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4">
                {/* Message History */}
                <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {sampleMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromUser 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.sender} • {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">No conversation selected</p>
                  <p className="text-sm text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;