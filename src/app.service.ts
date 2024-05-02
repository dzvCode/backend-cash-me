import { Injectable } from '@nestjs/common';
const packageJson = require('../package.json');

@Injectable()
export class AppService {
  getProjectInfo(): object {
    const projectInfo = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      repository: packageJson.repository,
    };

    return projectInfo;
  }

  healthCheck(): string {
    return 'pong!';
  }
}
