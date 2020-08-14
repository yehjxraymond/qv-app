import { decryptStringWithPrivateKey } from "./encryption";

export const decryptElectionResults = async (election, privateKey) => {
  const decryptedVotesDefered = election.votes.map(async (vote) => {
    const decryptedVote = await decryptStringWithPrivateKey(
      vote.encryptedVote,
      privateKey
    );
    return { ...vote, votes: JSON.parse(decryptedVote) };
  });
  const decryptedVotes = await Promise.all(decryptedVotesDefered);
  return { ...election, votes: decryptedVotes };
};
