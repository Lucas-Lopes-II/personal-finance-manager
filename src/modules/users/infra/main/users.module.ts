import { Module } from '@nestjs/common';
import { UsersController } from '@users/infra/controllers';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
