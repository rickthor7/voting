
import { Election, ElectionType } from '../models/Election';
import { Candidate } from '../models/Candidate';
import { Admin, Voter } from '../models/User';
import { Vote } from '../models/Vote';

// Singleton pattern for data service
export class DataService {
  private static instance: DataService;
  
  private elections: Map<string, Election> = new Map();
  private candidates: Map<string, Candidate> = new Map();
  private users: Map<string, Admin | Voter> = new Map();
  private votes: Map<string, Vote> = new Map();
  
  private currentUser: Admin | Voter | null = null;

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Initialize with sample data
  private initializeData(): void {
    // Create admin user
    const admin = new Admin(
      '1',
      'Admin User',
      'admin@example.com',
      'admin123',
      1
    );
    this.users.set(admin.getId(), admin);

    // Create some voter users
    const voter1 = new Voter(
      '2',
      'John Doe',
      'john@example.com',
      'password123',
      'V001'
    );
    const voter2 = new Voter(
      '3',
      'Jane Smith',
      'jane@example.com',
      'password123',
      'V002'
    );
    const voter3 = new Voter(
      '4',
      'Bob Brown',
      'bob@example.com',
      'password123',
      'V003'
    );

    this.users.set(voter1.getId(), voter1);
    this.users.set(voter2.getId(), voter2);
    this.users.set(voter3.getId(), voter3);

    // Create sample elections
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Past election
    const pastElection = new Election(
      '1',
      'Past Election',
      'This election has already ended',
      lastWeek,
      yesterday,
      admin.getId(),
      ElectionType.SIMPLE_MAJORITY
    );

    // Active election
    const activeElection = new Election(
      '2',
      'Current School President Election',
      'Vote for the next school president for the academic year 2025',
      yesterday,
      tomorrow,
      admin.getId(),
      ElectionType.SIMPLE_MAJORITY
    );

    // Future election
    const futureElection = new Election(
      '3',
      'Future Class Representative Election',
      'Vote for your class representatives',
      tomorrow,
      nextWeek,
      admin.getId(),
      ElectionType.RANKED_CHOICE
    );

    this.elections.set(pastElection.getId(), pastElection);
    this.elections.set(activeElection.getId(), activeElection);
    this.elections.set(futureElection.getId(), futureElection);

    // Create candidates for active election
    const candidate1 = new Candidate(
      '1',
      'Alice Johnson',
      'Junior, Honor Student, Student Council Experience',
      '/candidate1.jpg',
      activeElection.getId()
    );
    
    const candidate2 = new Candidate(
      '2',
      'Michael Chen',
      'Senior, Debate Team Captain, Leadership Experience',
      '/candidate2.jpg',
      activeElection.getId()
    );
    
    const candidate3 = new Candidate(
      '3',
      'Sofia Rodriguez',
      'Sophomore, Class Treasurer, Community Service Leader',
      '/candidate3.jpg',
      activeElection.getId()
    );

    this.candidates.set(candidate1.getId(), candidate1);
    this.candidates.set(candidate2.getId(), candidate2);
    this.candidates.set(candidate3.getId(), candidate3);

    // Add candidates to active election
    activeElection.addCandidate(candidate1);
    activeElection.addCandidate(candidate2);
    activeElection.addCandidate(candidate3);

    // Create candidates for future election
    const candidate4 = new Candidate(
      '4',
      'David Wilson',
      'Junior, Math Club President',
      '/candidate4.jpg',
      futureElection.getId()
    );
    
    const candidate5 = new Candidate(
      '5',
      'Emily Turner',
      'Senior, Arts Committee Chair',
      '/candidate5.jpg',
      futureElection.getId()
    );

    this.candidates.set(candidate4.getId(), candidate4);
    this.candidates.set(candidate5.getId(), candidate5);

    // Add candidates to future election
    futureElection.addCandidate(candidate4);
    futureElection.addCandidate(candidate5);
  }

  // Authentication methods
  login(email: string, password: string): Admin | Voter | null {
    for (const user of this.users.values()) {
      if (user.authenticate(email, password)) {
        this.currentUser = user;
        return user;
      }
    }
    return null;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): Admin | Voter | null {
    return this.currentUser;
  }

  // Election methods
  getElections(): Election[] {
    return Array.from(this.elections.values());
  }

  getElection(id: string): Election | undefined {
    return this.elections.get(id);
  }

  getActiveElections(): Election[] {
    return Array.from(this.elections.values()).filter(election => election.isActive());
  }

  getFutureElections(): Election[] {
    const now = new Date();
    return Array.from(this.elections.values()).filter(election => election.getStartDate() > now);
  }

  getPastElections(): Election[] {
    const now = new Date();
    return Array.from(this.elections.values()).filter(election => election.getEndDate() < now);
  }

  createElection(
    name: string, 
    description: string, 
    startDate: Date, 
    endDate: Date, 
    createdBy: string, 
    type: ElectionType
  ): Election {
    const election = Election.createElection(name, description, startDate, endDate, createdBy, type);
    this.elections.set(election.getId(), election);
    return election;
  }

  // Candidate methods
  getCandidates(electionId: string): Candidate[] {
    return Array.from(this.candidates.values()).filter(
      candidate => candidate.getElectionId() === electionId
    );
  }

  createCandidate(
    name: string, 
    description: string, 
    imageUrl: string, 
    electionId: string
  ): Candidate {
    const candidate = new Candidate(
      crypto.randomUUID(),
      name,
      description,
      imageUrl,
      electionId
    );
    
    this.candidates.set(candidate.getId(), candidate);
    
    // Add to the election
    const election = this.elections.get(electionId);
    if (election) {
      election.addCandidate(candidate);
    }
    
    return candidate;
  }

  // Voting methods
  castVote(voterId: string, electionId: string, candidateId: string): Vote {
    const election = this.elections.get(electionId);
    const voter = this.users.get(voterId) as Voter;
    
    if (!election || !voter) {
      throw new Error('Election or voter not found');
    }
    
    if (!(voter instanceof Voter)) {
      throw new Error('User is not a voter');
    }
    
    if (voter.hasVotedInElection(electionId)) {
      throw new Error('Voter has already voted in this election');
    }
    
    if (!election.isActive()) {
      throw new Error('Election is not currently active');
    }
    
    // Create the vote
    const vote = new Vote(
      crypto.randomUUID(),
      voterId,
      electionId,
      candidateId,
      new Date()
    );
    
    // Store the vote
    this.votes.set(vote.getId(), vote);
    
    // Mark the voter as having voted
    voter.markAsVoted(electionId);
    
    // Cast the vote using the election's voting method
    election.getVotingMethod().castVote(voterId, candidateId);
    
    return vote;
  }

  // Results methods
  getElectionResults(electionId: string): Map<string, number> {
    const election = this.elections.get(electionId);
    
    if (!election) {
      throw new Error('Election not found');
    }
    
    return election.getVotingMethod().calculateResults();
  }

  getVotesCount(electionId: string): number {
    return Array.from(this.votes.values()).filter(
      vote => vote.getElectionId() === electionId
    ).length;
  }

  hasVoted(voterId: string, electionId: string): boolean {
    const voter = this.users.get(voterId);
    
    if (voter instanceof Voter) {
      return voter.hasVotedInElection(electionId);
    }
    
    return false;
  }
}
