
import { Candidate } from './Candidate';
import { VotingMethod, SimpleMajorityVoting, RankedChoiceVoting } from './VotingMethod';

// Election types enum
export enum ElectionType {
  SIMPLE_MAJORITY = 'SIMPLE_MAJORITY',
  RANKED_CHOICE = 'RANKED_CHOICE'
}

// Abstract base class for elections
export abstract class BaseElection {
  protected id: string;
  protected name: string;
  protected description: string;
  protected startDate: Date;
  protected endDate: Date;
  protected createdBy: string;
  protected candidates: Candidate[] = [];

  constructor(
    id: string,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    createdBy: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdBy = createdBy;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getCreatedBy(): string {
    return this.createdBy;
  }

  getCandidates(): Candidate[] {
    return [...this.candidates];
  }

  // Add candidate
  addCandidate(candidate: Candidate): void {
    this.candidates.push(candidate);
  }

  // Check if election is active
  isActive(): boolean {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }

  // Abstract methods
  abstract getVotingMethod(): VotingMethod;
  abstract getType(): ElectionType;
}

// Concrete Election class (combines abstract class and implementation)
export class Election extends BaseElection {
  private type: ElectionType;
  private votingMethod: VotingMethod;

  constructor(
    id: string,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    createdBy: string,
    type: ElectionType = ElectionType.SIMPLE_MAJORITY
  ) {
    super(id, name, description, startDate, endDate, createdBy);
    this.type = type;
    
    // Polymorphic behavior - choose implementation based on type
    if (type === ElectionType.RANKED_CHOICE) {
      this.votingMethod = new RankedChoiceVoting(id);
    } else {
      this.votingMethod = new SimpleMajorityVoting(id);
    }
  }

  // Implementation of abstract methods
  getVotingMethod(): VotingMethod {
    return this.votingMethod;
  }

  getType(): ElectionType {
    return this.type;
  }

  // Factory method to create different types of elections
  static createElection(
    name: string, 
    description: string, 
    startDate: Date, 
    endDate: Date, 
    createdBy: string, 
    type: ElectionType
  ): Election {
    return new Election(
      crypto.randomUUID(),
      name,
      description,
      startDate,
      endDate,
      createdBy,
      type
    );
  }
}
