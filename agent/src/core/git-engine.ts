import * as simpleGit from 'simple-git';

export class GitEngine {
  async commitAndPush(repoPath: string, message: string, push: boolean): Promise<string> {
    const git = simpleGit.simpleGit(repoPath);

    const status = await git.status();
    if (status.files.length === 0) {
      throw new Error('No changes to commit');
    }

    await git.add('.');
    const result = await git.commit(message);
    const hash = result.commit || 'unknown';

    if (push) {
      await git.push('origin', status.current || 'main');
    }

    return hash;
  }

}
