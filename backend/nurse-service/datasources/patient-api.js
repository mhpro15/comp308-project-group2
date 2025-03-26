import { RESTDataSource } from '@apollo/datasource-rest';

export default class PatientAPI extends RESTDataSource {
  baseURL = process.env.PATIENT_SERVICE_URL || 'http://localhost:4000/'; // Patient service URL

  async getPatientById(id) {
    return this.get(`patients/${id}`);
  }

  async getPatientsByIds(ids) {
    return this.post('patients/batch', {
      body: { ids }
    });
  }

  // For GraphQL endpoint communication
  async getPatientGraphQL(id) {
    return this.post('/graphql', {
      body: {
        query: `
          query GetPatient($id: ID!) {
            patient(id: $id) {
              id
              fullName
              dateOfBirth
              # Include other needed fields
            }
          }
        `,
        variables: { id }
      }
    });
  }
}