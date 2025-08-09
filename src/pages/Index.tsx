import { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import QueueCard from '@/components/queue/QueueCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardStats, mockQueue, mockAppointments, QueueItem } from '@/lib/mockData';

const Index = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(mockQueue);

  const handleStatusUpdate = (id: string, newStatus: QueueItem['status']) => {
    setQueueItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const urgentQueue = queueItems.filter(item => item.status === 'urgent');
  const waitingQueue = queueItems.filter(item => item.status === 'waiting');
  const activeQueue = queueItems.filter(item => item.status === 'with-doctor');
  const todayAppointments = mockAppointments.filter(apt => apt.date === '2024-01-15');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-hero rounded-xl p-6 text-center shadow-medical">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to MediDesk Pro
              </h1>
              <p className="text-muted-foreground">
                Streamline your clinic operations with our comprehensive front desk management system
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Patients Today"
              value={dashboardStats.totalPatientsToday}
              icon={Users}
              trend={dashboardStats.trendsData.patientsToday}
              variant="primary"
            />
            <StatsCard
              title="Current Queue"
              value={dashboardStats.currentQueue}
              icon={Clock}
              trend={dashboardStats.trendsData.queueTime}
              variant="accent"
            />
            <StatsCard
              title="Completed Today"
              value={dashboardStats.completedToday}
              icon={CheckCircle}
              trend={dashboardStats.trendsData.appointments}
              variant="success"
            />
            <StatsCard
              title="Urgent Cases"
              value={dashboardStats.urgentCases}
              icon={AlertTriangle}
              variant="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queue Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Urgent Queue */}
              {urgentQueue.length > 0 && (
                <Card className="shadow-card-medical">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Urgent Cases</span>
                      <Badge variant="destructive">{urgentQueue.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {urgentQueue.map(item => (
                      <QueueCard 
                        key={item.id} 
                        item={item} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Active Queue */}
              <Card className="shadow-card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span>Active Queue</span>
                      <Badge variant="secondary">{activeQueue.length + waitingQueue.length}</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      Add Walk-in
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {waitingQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {activeQueue.length === 0 && waitingQueue.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No patients in queue</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span>Today's Appointments</span>
                  <Badge variant="secondary">{todayAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className="p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{appointment.patientName}</h4>
                      <Badge 
                        variant={appointment.status === 'completed' ? 'secondary' : 'default'}
                        className={appointment.status === 'completed' ? 'bg-success text-success-foreground' : ''}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appointment.type}</p>
                  </div>
                ))}
                {todayAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
                  <Users className="w-6 h-6" />
                  <span>Add Patient</span>
                </Button>
                <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
                  <Calendar className="w-6 h-6" />
                  <span>Book Appointment</span>
                </Button>
                <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
                  <UserCheck className="w-6 h-6" />
                  <span>Manage Doctors</span>
                </Button>
                <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
                  <Activity className="w-6 h-6" />
                  <span>View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
