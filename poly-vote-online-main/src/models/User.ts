
// Abstract class for User
export abstract class User {
  protected id: string;
  protected name: string;
  protected email: string;
  protected password: string;

  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // Getter methods
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  // Abstract method that must be implemented by subclasses
  abstract getRole(): string;

  // Method to authenticate user
  authenticate(email: string, password: string): boolean {
    return this.email === email && this.password === password;
  }
}

// Admin class that extends User (inheritance)
export class Admin extends User {
  private adminLevel: number;

  constructor(id: string, name: string, email: string, password: string, adminLevel: number = 1) {
    super(id, name, email, password);
    this.adminLevel = adminLevel;
  }

  getRole(): string {
    return 'Admin';
  }

  getAdminLevel(): number {
    return this.adminLevel;
  }

  // Admin-specific method
  createElection(name: string, description: string, startDate: Date, endDate: Date): Election {
    return new Election(
      crypto.randomUUID(),
      name,
      description,
      startDate,
      endDate,
      this.id
    );
  }
}

// Voter class that extends User (inheritance)
export class Voter extends User {
  private voterId: string;
  private hasVoted: Map<string, boolean> = new Map();

  constructor(id: string, name: string, email: string, password: string, voterId: string) {
    super(id, name, email, password);
    this.voterId = voterId;
  }

  getRole(): string {
    return 'Voter';
  }

  getVoterId(): string {
    return this.voterId;
  }

  // Check if voter has already voted in a specific election
  hasVotedInElection(electionId: string): boolean {
    return this.hasVoted.get(electionId) || false;
  }

  // Mark voter as having voted in a specific election
  markAsVoted(electionId: string): void {
    this.hasVoted.set(electionId, true);
  }

  // Vote in an election
  vote(election: Election, candidateId: string): Vote {
    if (this.hasVotedInElection(election.getId())) {
      throw new Error('Voter has already voted in this election');
    }

    this.markAsVoted(election.getId());
    
    return new Vote(
      crypto.randomUUID(),
      this.id,
      election.getId(),
      candidateId,
      new Date()
    );
  }
}

// Import at the end to avoid circular dependencies
import { Election } from './Election';
import { Vote } from './Vote';
