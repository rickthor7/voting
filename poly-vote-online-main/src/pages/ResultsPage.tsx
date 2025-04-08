
import { useParams } from 'react-router-dom';
import ElectionsList from '../components/ElectionsList';
import ElectionResults from '../components/ElectionResults';

const ResultsPage = () => {
  const { electionId } = useParams<{ electionId?: string }>();

  return (
    <>
      {electionId ? <ElectionResults /> : <ElectionsList />}
    </>
  );
};

export default ResultsPage;
