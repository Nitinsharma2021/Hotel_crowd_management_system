import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { aiAgentAPI } from '../services/api';
import toast from 'react-hot-toast';

const ReservationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Build prompt from form data
      const prompt = `book table for ${data.partySize} persons on ${data.date} at ${data.time} for ${data.name} (${data.email}, ${data.phone})`;
      const response = await aiAgentAPI.processRequest(prompt);
      toast.success(response.data.aiResponse.response || 'Reservation processed!');
      // Reset form
      setValue('name', '');
      setValue('email', '');
      setValue('phone', '');
      setValue('date', '');
      setValue('time', '');
      setValue('partySize', '');
      setValue('dietaryRestrictions', '');
      setValue('seatingPreference', '');
      setValue('specialRequests', '');
    } catch (error) {
      toast.error('Failed to process reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Reservation</h1>
        <p className="text-gray-600">
          Book your table with our easy-to-use reservation system
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reservation Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Reservation Details
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Enter your full name" />
                {errors.name && (<p className="text-red-600 text-sm mt-1">{errors.name.message}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" {...register('email', { required: 'Email is required' })} className="input-field" placeholder="Enter your email" />
                {errors.email && (<p className="text-red-600 text-sm mt-1">{errors.email.message}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" {...register('phone', { required: 'Phone number is required' })} className="input-field" placeholder="Enter your phone number" />
                {errors.phone && (<p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>)}
              </div>
            </div>
            {/* Reservation Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" {...register('date', { required: 'Date is required' })} className="input-field" min={getMinDate()} />
                  {errors.date && (<p className="text-red-600 text-sm mt-1">{errors.date.message}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input type="time" {...register('time', { required: 'Time is required' })} className="input-field" />
                  {errors.time && (<p className="text-red-600 text-sm mt-1">{errors.time.message}</p>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Party Size *</label>
                <input type="number" {...register('partySize', { required: 'Party size is required', min: 1 })} className="input-field" placeholder="Number of people" />
                {errors.partySize && (<p className="text-red-600 text-sm mt-1">{errors.partySize.message}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                <input type="text" {...register('dietaryRestrictions')} className="input-field" placeholder="e.g., Vegetarian, Gluten-free, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seating Preference</label>
                <input type="text" {...register('seatingPreference')} className="input-field" placeholder="e.g., Window, Outdoor, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea {...register('specialRequests')} className="input-field" rows="3" placeholder="Any special requests or notes..." />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Book Reservation'}
            </button>
          </form>
        </div>
        {/* Optionally, you can show a summary or instructions in the other column */}
      </div>
    </div>
  );
};

export default ReservationForm; 