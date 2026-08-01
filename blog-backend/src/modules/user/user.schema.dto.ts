export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  avatarLink?: string;
  telegram?: string;
  vk?: string;
  gitHub?: string;
  linkedin?: string;
  mySite?: string;
}

export class GetUserResponseDto {
  name: string;
  email: string;
  avatarLink?: string;
  telegram?: string;
  vk?: string;
  gitHub?: string;
  linkedin?: string;
  mySite?: string;
}

export class UpdateUserResponseDto {
  name: string;
  email: string;
  avatarLink?: string;
  telegram?: string;
  vk?: string;
  gitHub?: string;
  linkedin?: string;
  mySite?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  access_token: string;
}
