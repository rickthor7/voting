
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Award, Vote, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/DataService';
import { Link } from 'react-router-dom';
import { Election } from '../models/Election';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [totalElections, setTotalElections] = useState(0);
  const dataService = DataService.getInstance();

  useEffect(() => {
    // Fetch active elections
    const active = dataService.getActiveElections();
    setActiveElections(active);
    
    // Get total elections count
    const all = dataService.getElections();
    setTotalElections(all.length);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.getName()}</h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your elections
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeElections.length}</div>
            <p className="text-xs text-gray-500">Elections you can vote in now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElections}</div>
            <p className="text-xs text-gray-500">All elections past, present and future</p>
          </CardContent>
        </Card>
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">User Role</CardTitle>
                <Vote className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.getRole()}</div>
                <p className="text-xs text-gray-500">Admin access granted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Admin Level</CardTitle>
                <BarChart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user && 'getAdminLevel' in user ? user.getAdminLevel() : '-'}
                </div>
                <p className="text-xs text-gray-500">Your administration level</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Active elections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Active Elections</h2>
          <Link to="/vote">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeElections.length > 0 ? (
            activeElections.map((election) => (
              <Card key={election.getId()}>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{election.getName()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {election.getDescription()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ends:</span>{' '}
                    {election.getEndDate().toLocaleDateString()}
                  </p>
                  <Link to={`/vote/${election.getId()}`}>
                    <Button className="w-full bg-vote-primary hover:bg-vote-secondary">
                      Vote Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No active elections at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Admin Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Calendar className="h-8 w-8 text-vote-primary" />
                  <h3 className="text-center font-medium">Create Election</h3>
                  <p className="text-center text-sm text-gray-500">
                    Set up a new election with candidates
                  </p>
                  <Link to="/admin/create-election">
                    <Button className="mt-2 bg-vote-primary hover:bg-vote-secondary">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Award className="h-8 w-8 text-vote-primary" />
                  <h3 className="text-center font-medium">Manage Candidates</h3>
                  <p className="text-center text-sm text-gray-500">
                    Add or edit candidates for elections
                  </p>
                  <Link to="/admin/candidates">
                    <Button className="mt-2 bg-vote-primary hover:bg-vote-secondary">
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <BarChart className="h-8 w-8 text-vote-primary" />
                  <h3 className="text-center font-medium">View All Results</h3>
                  <p className="text-center text-sm text-gray-500">
                    See results for all completed elections
                  </p>
                  <Link to="/results">
                    <Button className="mt-2 bg-vote-primary hover:bg-vote-secondary">
                      View Results
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
