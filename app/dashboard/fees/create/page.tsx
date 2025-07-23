'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, DollarSign, Calculator } from 'lucide-react';

const CreateFeePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    feeAmount: '',
    currency: 'XAF',
    dueDate: '',
    description: '',
    semester: '',
    specialty: '',
    paymentPlan: 'full',
    installments: '1',
    lateFeeEnabled: true,
    lateFeeAmount: '50',
    lateFeeType: 'fixed',
    discountEnabled: false,
    discountAmount: '',
    discountType: 'percentage',
    notes: ''
  });

  const students = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', university: 'Columbia University' },
    { id: '2', name: 'Michael Chen', email: 'michael.chen@email.com', university: 'Stanford University' },
    { id: '3', name: 'Emma Davis', email: 'emma.davis@email.com', university: 'MIT' },
    { id: '4', name: 'David Wilson', email: 'david.wilson@email.com', university: 'University of Washington' }
  ];

  const internships = [
    { id: '1', title: 'Software Engineering Intern', company: 'Google Inc.' },
    { id: '2', title: 'Data Science Intern', company: 'Meta' },
    { id: '3', title: 'UX Design Intern', company: 'Apple' },
    { id: '4', title: 'Marketing Intern', company: 'Netflix' }
  ];

  const specialties = [
    'Software Development',
    'Data Analytics',
    'UX Design',
    'Digital Marketing',
    'Business Analysis',
    'Cybersecurity'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.feeAmount || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Fee record created successfully!', {
      description: 'The fee has been added and invoice will be generated.'
    });
    router.push('/dashboard/fees');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const baseAmount = parseFloat(formData.feeAmount) || 0;
    const discountAmount = formData.discountEnabled ? parseFloat(formData.discountAmount) || 0 : 0;
    
    let discount = 0;
    if (formData.discountEnabled) {
      if (formData.discountType === 'percentage') {
        discount = (baseAmount * discountAmount) / 100;
      } else {
        discount = discountAmount;
      }
    }
    
    return Math.max(0, baseAmount - discount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Fee Record</h1>
          <p className="text-sm text-muted-foreground">Add a new internship fee record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Fee Information
              </CardTitle>
              <CardDescription>Enter the fee details and payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => handleInputChange('studentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internshipId">Internship</Label>
                  <Select value={formData.internshipId} onValueChange={(value) => handleInputChange('internshipId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select internship" />
                    </SelectTrigger>
                    <SelectContent>
                      {internships.map((internship) => (
                        <SelectItem key={internship.id} value={internship.id}>
                          {internship.title} - {internship.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feeAmount">Fee Amount *</Label>
                  <Input
                    id="feeAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.feeAmount}
                    onChange={(e) => handleInputChange('feeAmount', e.target.value)}
                    placeholder="2500.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XAF">XAF (FCFA)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    placeholder="Spring 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Internship placement fee for Spring 2024 semester..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Internal notes for this fee record..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Payment Options
              </CardTitle>
              <CardDescription>Configure payment terms and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentPlan">Payment Plan</Label>
                <Select value={formData.paymentPlan} onValueChange={(value) => handleInputChange('paymentPlan', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="installments">Installments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentPlan === 'installments' && (
                <div className="space-y-2">
                  <Label htmlFor="installments">Number of Installments</Label>
                  <Select value={formData.installments} onValueChange={(value) => handleInputChange('installments', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Installments</SelectItem>
                      <SelectItem value="3">3 Installments</SelectItem>
                      <SelectItem value="4">4 Installments</SelectItem>
                      <SelectItem value="6">6 Installments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Late Fee</Label>
                    <p className="text-sm text-muted-foreground">Charge late fee for overdue payments</p>
                  </div>
                  <Switch
                    checked={formData.lateFeeEnabled}
                    onCheckedChange={(checked) => handleInputChange('lateFeeEnabled', checked)}
                  />
                </div>

                {formData.lateFeeEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="lateFeeAmount">Late Fee Amount</Label>
                      <Input
                        id="lateFeeAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.lateFeeAmount}
                        onChange={(e) => handleInputChange('lateFeeAmount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lateFeeType">Type</Label>
                      <Select value={formData.lateFeeType} onValueChange={(value) => handleInputChange('lateFeeType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Discount</Label>
                    <p className="text-sm text-muted-foreground">Apply discount to this fee</p>
                  </div>
                  <Switch
                    checked={formData.discountEnabled}
                    onCheckedChange={(checked) => handleInputChange('discountEnabled', checked)}
                  />
                </div>

                {formData.discountEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="discountAmount">Discount Amount</Label>
                      <Input
                        id="discountAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discountAmount}
                        onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Type</Label>
                      <Select value={formData.discountType} onValueChange={(value) => handleInputChange('discountType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {formData.feeAmount && (
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Amount:</span>
                      <span>{parseFloat(formData.feeAmount || '0').toLocaleString()} FCFA</span>
                    </div>
                    {formData.discountEnabled && formData.discountAmount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-{formData.discountType === 'percentage' 
                          ? ((parseFloat(formData.feeAmount) * parseFloat(formData.discountAmount)) / 100).toLocaleString()
                          : parseFloat(formData.discountAmount).toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span>{calculateTotal().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={() => {
            toast.info('Draft saved', {
              description: 'Fee record has been saved as a draft.'
            });
          }}>
            Save as Draft
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Create Fee Record
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeePage;