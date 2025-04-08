
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { DataService } from '../services/DataService';
import { Election } from '../models/Election';
import { Candidate } from '../models/Candidate';
import { useAuth } from '../context/AuthContext';
import { User, AlertCircle, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

const VotingBooth: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dataService = DataService.getInstance();
  
  const [election, setElection] = useState<Election | undefined>(undefined);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    if (!electionId || !user) return;
    
    // Get election details
    const electionData = dataService.getElection(electionId);
    if (!electionData) {
      navigate('/elections');
      return;
    }
    
    setElection(electionData);
    
    // Get candidates
    const candidatesData = dataService.getCandidates(electionId);
    setCandidates(candidatesData);
    
    // Check if user has already voted
    const voted = dataService.hasVoted(user.getId(), electionId);
    setHasVoted(voted);
    
  }, [electionId, user, navigate]);

  const handleVote = () => {
    if (!user || !election || !selectedCandidate) return;
    
    setIsSubmitting(true);
    
    try {
      // Cast vote
      dataService.castVote(user.getId(), election.getId(), selectedCandidate);
      
      // Update state
      setIsCompleted(true);
      setHasVoted(true);
      
      // Show success toast
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded.",
        variant: "default",
      });
      
      // Redirect to results after a delay
      setTimeout(() => {
        navigate(`/results/${election.getId()}`);
      }, 2000);
      
    } catch (error) {
      let message = "An error occurred while casting your vote.";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Voting Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!election) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Election Not Found</h3>
            <p className="text-gray-500 mt-2">
              The election you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button 
              className="mt-4 bg-vote-primary hover:bg-vote-secondary"
              onClick={() => navigate('/elections')}
            >
              View All Elections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasVoted || isCompleted) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
            <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">Vote Successfully Cast</h3>
            <p className="text-gray-500 mt-2">
              Thank you for participating in this election! Your vote has been recorded.
            </p>
            <Button 
              className="mt-4 bg-vote-primary hover:bg-vote-secondary"
              onClick={() => navigate(`/results/${election.getId()}`)}
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{election.getName()}</h1>
        <p className="text-gray-500 mt-1">
          Cast your vote in this election
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Your vote is confidential. Once submitted, you cannot change your vote for this election.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Election Information</CardTitle>
          <CardDescription>{election.getDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Start Date:</span> {election.getStartDate().toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">End Date:</span> {election.getEndDate().toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Voting Method:</span> {election.getVotingMethod().getMethodName()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Your Candidate</CardTitle>
          <CardDescription>
            Please select one candidate from the list below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.getId()} className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={candidate.getId()} 
                    id={candidate.getId()} 
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={candidate.getId()}
                    className="flex flex-col cursor-pointer p-3 rounded-md w-full hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-vote-accent flex items-center justify-center">
                        <User className="h-5 w-5 text-vote-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{candidate.getName()}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {candidate.getDescription()}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-vote-primary hover:bg-vote-secondary" 
            onClick={handleVote}
            disabled={!selectedCandidate || isSubmitting}
          >
            {isSubmitting ? "Submitting vote..." : "Cast Your Vote"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VotingBooth;
