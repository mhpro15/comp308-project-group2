import { gql, useQuery } from "@apollo/client";

const GET_MOTIVATIONS = gql`
  query MotivationsForPatient($patientId: ID!) {
    motivationsByPatient(patientId: $patientId) {
      id
      title
      content
      timeStamp
      NurseID {
        name
      }
    }
  }
`;

export function MotivationInbox({ patientId }) {
  const { data, loading } = useQuery(GET_MOTIVATIONS, {
    variables: { patientId },
    pollInterval: 5000, // Poll every 5 sec to simulate real-time chat
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data.motivationsByPatient.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.title}</strong>
          <p>{msg.content}</p>
          <small>From Nurse: {msg.NurseID[0].name}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}
