import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDoctorAdded: () => void;
}

const AddDoctorDialog = ({ open, onOpenChange, onDoctorAdded }: AddDoctorDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    location: '',
    phone: '',
    email: '',
    maxPatients: '10'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'ENT',
    'Gastroenterology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry'
  ];

  const locations = [
    'Room 101',
    'Room 102', 
    'Room 103',
    'Room 201',
    'Room 202',
    'Emergency Room',
    'Consultation Room A',
    'Consultation Room B'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('doctors')
        .insert({
          name: formData.name,
          specialization: formData.specialization,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          max_patients: parseInt(formData.maxPatients),
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Doctor added successfully.",
      });

      setFormData({
        name: '',
        specialization: '',
        location: '',
        phone: '',
        email: '',
        maxPatients: '10'
      });
      onDoctorAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add doctor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Enter the doctor's information to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Select
              value={formData.specialization}
              onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPatients">Max Patients</Label>
              <Input
                id="maxPatients"
                type="number"
                value={formData.maxPatients}
                onChange={(e) => setFormData({ ...formData, maxPatients: e.target.value })}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="doctor@clinic.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;