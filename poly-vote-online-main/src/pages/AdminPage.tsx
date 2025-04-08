
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';

const AdminPage = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage elections and system settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Operations</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Admin Features Coming Soon</h3>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            This is a demonstration of the OOP concepts. Admin features for creating elections
            and managing candidates will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
