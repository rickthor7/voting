
export class Vote {
  private id: string;
  private voterId: string;
  private electionId: string;
  private candidateId: string;
  private timestamp: Date;

  constructor(
    id: string,
    voterId: string,
    electionId: string,
    candidateId: string,
    timestamp: Date
  ) {
    this.id = id;
    this.voterId = voterId;
    this.electionId = electionId;
    this.candidateId = candidateId;
    this.timestamp = timestamp;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getVoterId(): string {
    return this.voterId;
  }

  getElectionId(): string {
    return this.electionId;
  }

  getCandidateId(): string {
    return this.candidateId;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}
