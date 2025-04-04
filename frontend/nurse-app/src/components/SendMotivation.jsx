import { gql, useMutation } from "@apollo/client";

const CREATE_MOTIVATION = gql`
  mutation CreateMotivation($input: MotivationInput!) {
    createMotivation(input: $input) {
      id
      title
      content
      timeStamp
      PatientID {
        id
        name
      }
      NurseID {
        id
        name
      }
    }
  }
`;

export function SendMotivation({ nurseId, patientId }) {
  const [createMotivation] = useMutation(CREATE_MOTIVATION);

  const handleSend = () => {
    createMotivation({
      variables: {
        input: {
          PatientID: patientId,
          NurseID: nurseId,
          title: "Daily Encouragement",
          content: "You're doing great! Keep it up!",
          timeStamp: new Date().toISOString(),
        },
      },
    })
      .then((res) => {
        console.log("Motivation sent:", res.data.createMotivation);
      })
      .catch((err) => {
        console.error("Failed to send motivation:", err.message);
      });
  };

  return <button onClick={handleSend}>Send Motivation</button>;
}
