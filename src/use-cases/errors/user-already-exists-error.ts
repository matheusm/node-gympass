export class UserAlreadyExists extends Error {
  constructor() {
    super('Email already exists')
  }
}
