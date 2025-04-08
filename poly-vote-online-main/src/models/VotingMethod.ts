
// Interface for voting methods (Interface)
export interface VotingMethod {
  castVote(voterId: string, candidateId: string): void;
  calculateResults(): Map<string, number>;
  getMethodName(): string;
}

// Implementation of a simple majority voting method
export class SimpleMajorityVoting implements VotingMethod {
  private votes: Map<string, string> = new Map(); // voterId -> candidateId
  private electionId: string;

  constructor(electionId: string) {
    this.electionId = electionId;
  }

  getMethodName(): string {
    return 'Simple Majority';
  }

  castVote(voterId: string, candidateId: string): void {
    // Each voter can only vote once
    if (this.votes.has(voterId)) {
      throw new Error('Voter has already cast a vote');
    }
    this.votes.set(voterId, candidateId);
  }

  calculateResults(): Map<string, number> {
    const results = new Map<string, number>();
    
    // Count votes for each candidate
    for (const candidateId of this.votes.values()) {
      const currentCount = results.get(candidateId) || 0;
      results.set(candidateId, currentCount + 1);
    }
    
    return results;
  }
}

// Implementation of ranked choice voting method (another implementation of VotingMethod)
export class RankedChoiceVoting implements VotingMethod {
  private votes: Map<string, string[]> = new Map(); // voterId -> ranked candidateIds
  private electionId: string;

  constructor(electionId: string) {
    this.electionId = electionId;
  }

  getMethodName(): string {
    return 'Ranked Choice';
  }

  castVote(voterId: string, candidateRanking: string): void {
    // Each voter can only vote once
    if (this.votes.has(voterId)) {
      throw new Error('Voter has already cast a vote');
    }
    
    // Parse the ranking string to an array
    const ranking = candidateRanking.split(',');
    this.votes.set(voterId, ranking);
  }

  calculateResults(): Map<string, number> {
    // This is a simplified implementation of ranked choice counting
    // In a real implementation, this would involve elimination rounds
    
    const firstChoiceVotes = new Map<string, number>();
    
    // Count first choice votes
    for (const ranking of this.votes.values()) {
      if (ranking.length > 0) {
        const firstChoice = ranking[0];
        const currentCount = firstChoiceVotes.get(firstChoice) || 0;
        firstChoiceVotes.set(firstChoice, currentCount + 1);
      }
    }
    
    return firstChoiceVotes;
  }
}
