import { useState } from 'react';
import { Plus, Search, UserCheck, MapPin, Clock, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockDoctors, Doctor } from '@/lib/mockData';

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableDoctors = doctors.filter(doctor => doctor.status === 'available');
  const busyDoctors = doctors.filter(doctor => doctor.status === 'busy');
  const offlineDoctors = doctors.filter(doctor => doctor.status === 'offline');

  const getStatusColor = (status: Doctor['status']) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'busy': return 'bg-warning text-warning-foreground';
      case 'offline': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const patientLoad = (doctor.currentPatients / doctor.maxPatients) * 100;

    return (
      <Card className="shadow-card-medical hover:shadow-medical transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
            <Badge className={getStatusColor(doctor.status)}>
              {doctor.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{doctor.location}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Patient Load</span>
                <span className="text-foreground font-medium">
                  {doctor.currentPatients}/{doctor.maxPatients}
                </span>
              </div>
              <Progress value={patientLoad} className="h-2" />
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-foreground mb-2">Today's Schedule</h4>
              {doctor.availability.slice(0, 2).map((schedule, index) => (
                <div key={index} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{schedule.day}</span>
                  <span>{schedule.startTime} - {schedule.endTime}</span>
                </div>
              ))}
              {doctor.availability.length > 2 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{doctor.availability.length - 2} more days
                </p>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                View Schedule
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
              <p className="text-muted-foreground">Manage doctor profiles, schedules, and availability</p>
            </div>
            <Button className="bg-gradient-primary shadow-medical">
              <Plus className="w-4 h-4 mr-2" />
              Add New Doctor
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Total Doctors"
              value={doctors.length}
              icon={UserCheck}
              variant="primary"
            />
            <StatsCard
              title="Available"
              value={availableDoctors.length}
              icon={Users}
              variant="success"
            />
            <StatsCard
              title="Busy"
              value={busyDoctors.length}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="Offline"
              value={offlineDoctors.length}
              icon={UserCheck}
              variant="accent"
            />
          </div>

          {/* Search */}
          <Card className="shadow-card-medical">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors by name, specialization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              All Doctors ({doctors.length})
            </Button>
            <Button variant="outline" size="sm" className="text-success border-success">
              Available ({availableDoctors.length})
            </Button>
            <Button variant="outline" size="sm" className="text-warning border-warning">
              Busy ({busyDoctors.length})
            </Button>
            <Button variant="outline" size="sm" className="text-muted-foreground">
              Offline ({offlineDoctors.length})
            </Button>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <Card className="shadow-card-medical">
              <CardContent className="text-center py-12">
                <UserCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Doctors Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add doctors to get started'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Specializations Overview */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle>Specializations Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from(new Set(doctors.map(doctor => doctor.specialization))).map(specialization => {
                  const count = doctors.filter(doctor => doctor.specialization === specialization).length;
                  const available = doctors.filter(doctor => 
                    doctor.specialization === specialization && doctor.status === 'available'
                  ).length;
                  
                  return (
                    <div key={specialization} className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">{specialization}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total</span>
                          <span className="text-foreground font-medium">{count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="text-success font-medium">{available}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}