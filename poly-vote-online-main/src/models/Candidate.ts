
export class Candidate {
  private id: string;
  private name: string;
  private description: string;
  private imageUrl: string;
  private electionId: string;

  constructor(
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    electionId: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.electionId = electionId;
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

  getImageUrl(): string {
    return this.imageUrl;
  }

  getElectionId(): string {
    return this.electionId;
  }
}
