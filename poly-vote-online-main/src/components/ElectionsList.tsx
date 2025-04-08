
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { DataService } from '../services/DataService';
import { Election } from '../models/Election';
import { useAuth } from '../context/AuthContext';

const ElectionCard: React.FC<{ election: Election }> = ({ election }) => {
  const { user } = useAuth();
  const dataService = DataService.getInstance();
  const now = new Date();
  const isActive = election.isActive();
  const isFuture = election.getStartDate() > now;
  const isPast = election.getEndDate() < now;
  
  const hasVoted = user ? dataService.hasVoted(user.getId(), election.getId()) : false;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{election.getName()}</CardTitle>
          {isActive && (
            <Badge className="bg-green-500">Active</Badge>
          )}
          {isFuture && (
            <Badge className="bg-blue-500">Upcoming</Badge>
          )}
          {isPast && (
            <Badge className="bg-gray-500">Ended</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {election.getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            {election.getStartDate().toLocaleDateString()} to {election.getEndDate().toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium mr-2">Voting Method:</span>
          <span>{election.getVotingMethod().getMethodName()}</span>
        </div>
        {isActive && hasVoted && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>You have voted in this election</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isActive && !hasVoted && (
          <Link to={`/vote/${election.getId()}`} className="w-full">
            <Button className="w-full bg-vote-primary hover:bg-vote-secondary">
              Vote Now
            </Button>
          </Link>
        )}
        {(isActive && hasVoted) || isPast ? (
          <Link to={`/results/${election.getId()}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Results
            </Button>
          </Link>
        ) : isFuture ? (
          <div className="w-full flex items-center justify-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>Voting begins {election.getStartDate().toLocaleDateString()}</span>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

const ElectionsList: React.FC = () => {
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [pastElections, setPastElections] = useState<Election[]>([]);
  const [futureElections, setFutureElections] = useState<Election[]>([]);
  const dataService = DataService.getInstance();

  useEffect(() => {
    // Fetch elections by category
    setActiveElections(dataService.getActiveElections());
    setPastElections(dataService.getPastElections());
    setFutureElections(dataService.getFutureElections());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Elections</h1>
        <p className="text-gray-500 mt-1">
          View and participate in all available elections
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active <span className="ml-1 text-xs">({activeElections.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming <span className="ml-1 text-xs">({futureElections.length})</span>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past <span className="ml-1 text-xs">({pastElections.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {activeElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeElections.map((election) => (
                <ElectionCard key={election.getId()} election={election} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
                <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Active Elections</h3>
                <p className="text-gray-500 mt-2">
                  There are no active elections at the moment. Check back later or view upcoming elections.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {futureElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {futureElections.map((election) => (
                <ElectionCard key={election.getId()} election={election} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
                <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Upcoming Elections</h3>
                <p className="text-gray-500 mt-2">
                  There are no upcoming elections scheduled at this time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {pastElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastElections.map((election) => (
                <ElectionCard key={election.getId()} election={election} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
                <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Past Elections</h3>
                <p className="text-gray-500 mt-2">
                  There are no past elections in the system yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionsList;
