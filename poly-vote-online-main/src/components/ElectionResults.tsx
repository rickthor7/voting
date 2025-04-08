
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { DataService } from '../services/DataService';
import { Election } from '../models/Election';
import { Candidate } from '../models/Candidate';
import { BarChart, AlertCircle, Trophy, User } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const ElectionResults: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const dataService = DataService.getInstance();
  
  const [election, setElection] = useState<Election | undefined>(undefined);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<Map<string, number>>(new Map());
  const [totalVotes, setTotalVotes] = useState(0);
  const [chartData, setChartData] = useState<Array<{name: string, votes: number}>>([]);
  
  useEffect(() => {
    if (!electionId) return;
    
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
    
    try {
      // Get results
      const resultsData = dataService.getElectionResults(electionId);
      setResults(resultsData);
      
      // Calculate total votes
      let total = 0;
      resultsData.forEach(count => {
        total += count;
      });
      setTotalVotes(total);
      
      // Prepare chart data
      const chartDataArray: Array<{name: string, votes: number}> = [];
      candidatesData.forEach(candidate => {
        const votes = resultsData.get(candidate.getId()) || 0;
        chartDataArray.push({
          name: candidate.getName(),
          votes: votes
        });
      });
      setChartData(chartDataArray);
      
    } catch (error) {
      console.error('Error fetching results:', error);
    }
    
  }, [electionId, navigate]);

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

  // Find the winner (candidate with most votes)
  const getWinner = () => {
    if (totalVotes === 0) return null;
    
    let winnerId = '';
    let maxVotes = 0;
    
    results.forEach((votes, candidateId) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerId = candidateId;
      }
    });
    
    return candidates.find(c => c.getId() === winnerId) || null;
  };
  
  const winner = getWinner();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{election.getName()} Results</h1>
        <p className="text-gray-500 mt-1">
          View the voting results for this election
        </p>
      </div>

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
          <p className="text-sm">
            <span className="font-medium">Total Votes:</span> {totalVotes}
          </p>
        </CardContent>
      </Card>

      {winner && (
        <Card className="bg-vote-accent border-vote-primary">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-vote-primary" />
              <CardTitle>Winner</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-vote-primary flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{winner.getName()}</h3>
              <p className="text-sm text-gray-600">{winner.getDescription()}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Votes:</span>{' '}
                {results.get(winner.getId()) || 0} ({totalVotes > 0 ? (((results.get(winner.getId()) || 0) / totalVotes) * 100).toFixed(1) : 0}%)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <CardTitle>Results Breakdown</CardTitle>
          </div>
          <CardDescription>
            Vote distribution among all candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalVotes > 0 ? (
            <>
              <div className="space-y-6 mb-8">
                {candidates.map((candidate) => {
                  const votes = results.get(candidate.getId()) || 0;
                  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={candidate.getId()} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium">{candidate.getName()}</div>
                        <div className="text-sm text-gray-500">
                          {votes} votes ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
              
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#2563EB">
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === winner?.getName() ? '#10B981' : '#2563EB'} 
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No votes yet</h3>
              <p className="text-gray-500 mt-2">
                This election hasn't received any votes yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionResults;
