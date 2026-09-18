export type Pet = {
  id: number;
  name: string;
  species: string;
  adopted: boolean;
  age: number;
  breed?: string;
  intakeDate?: Date | string | null;
  adoptionDate?: Date | string | null;
  medicalRecord?: {
    vaccinations: string[];
    weightKg: number;
    microchipId: string | null;
  };
  photo?: string;
};

export const seedPets: Pet[] = [
  {
    id: 1,
    name: 'Buddy',
    species: 'Dog',
    adopted: true,
    age: 3,
    breed: 'Golden Retriever',
    intakeDate: '2024-06-15',
    adoptionDate: '2024-07-10',
    medicalRecord: {
      vaccinations: ['Rabies', 'Distemper', 'Parvovirus'],
      weightKg: 30,
      microchipId: null,
    },
    photo: 'buddy-golden-retriever.jpg',
  },
  {
    id: 2,
    name: 'Mittens',
    species: 'Cat',
    adopted: false,
    age: 2,
    breed: 'Tabby',
    intakeDate: '2024-06-20',
    adoptionDate: '2024-07-05',
    medicalRecord: {
      vaccinations: ['Rabies', 'Feline Leukemia'],
      weightKg: 5,
      microchipId: null,
    },
    photo: 'mittens-tabby.jpg',
  },
  {
    id: 3,
    name: 'Charlie',
    species: 'Dog',
    adopted: true,
    age: 5,
    breed: 'Beagle',
    intakeDate: '2024-05-10',
    adoptionDate: null,
    medicalRecord: {
      vaccinations: ['Rabies', 'Distemper'],
      weightKg: 20,
      microchipId: '1234567890',
    },
    photo: 'charlie-beagle.jpg',
  },
  {
    id: 4,
    name: 'Luna',
    species: 'Cat',
    adopted: true,
    age: 1,
    breed: 'Siamese',
    intakeDate: '2024-07-01',
    adoptionDate: null,
    medicalRecord: {
      vaccinations: ['Rabies', 'Feline Leukemia'],
      weightKg: 4,
      microchipId: '0987654321',
    },
    photo: 'luna-siamese.jpg',
  },
];
