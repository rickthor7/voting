
import { useParams } from 'react-router-dom';
import ElectionsList from '../components/ElectionsList';
import VotingBooth from '../components/VotingBooth';

const VotePage = () => {
  const { electionId } = useParams<{ electionId?: string }>();

  return (
    <>
      {electionId ? <VotingBooth /> : <ElectionsList />}
    </>
  );
};

export default VotePage;
