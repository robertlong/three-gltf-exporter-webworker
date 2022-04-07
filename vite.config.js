let base = "/";

const repo = process.env.GITHUB_REPOSITORY;

if (repo) {
  base = `/${repo.split("/")[1]}/`;
}

export default {
  base
};