export interface LocationState {
  code: string;
  name: string;
  districts: {
    name: string;
    cities: string[];
  }[];
}

export const STATES_AND_UT: LocationState[] = [
  {
    code: 'TN',
    name: 'Tamil Nadu',
    districts: [
      {
        name: 'Ariyalur',
        cities: ['Ariyalur', 'Jayankondam', 'Sendurai', 'Udayarpalayam'],
      },
      {
        name: 'Chengalpattu',
        cities: ['Chengalpattu', 'Tambaram', 'Pallavaram', 'Chromepet', 'Maduranthakam', 'Mahabalipuram', 'Guduvanchery'],
      },
      {
        name: 'Chennai',
        cities: [
          'Chennai Central',
          'Greams Road',
          'Thousand Lights',
          'T. Nagar',
          'Anna Nagar',
          'Adyar',
          'Mylapore',
          'Guindy',
          'Kilpauk',
          'Royapettah',
          'Egmore',
          'Velachery',
          'Perambur',
          'Triplicane',
          'Vadapalani',
        ],
      },
      {
        name: 'Coimbatore',
        cities: ['Coimbatore', 'Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Pollachi', 'Mettupalayam', 'Sulur'],
      },
      {
        name: 'Cuddalore',
        cities: ['Cuddalore', 'Chidambaram', 'Panruti', 'Vridhachalam', 'Neyveli', 'Kattumannarkoil'],
      },
      {
        name: 'Dharmapuri',
        cities: ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Pappireddipatti'],
      },
      {
        name: 'Dindigul',
        cities: ['Dindigul', 'Palani', 'Kodaikanal', 'Oddanchatram', 'Natham', 'Nilakottai'],
      },
      {
        name: 'Erode',
        cities: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam', 'Anthiyur'],
      },
      {
        name: 'Kallakurichi',
        cities: ['Kallakurichi', 'Sankarapuram', 'Chinnasalem', 'Ulundurpet', 'Tirukkoyilur'],
      },
      {
        name: 'Kanchipuram',
        cities: ['Kanchipuram', 'Sriperumbudur', 'Walajabad', 'Uthiramerur', 'Kundrathur'],
      },
      {
        name: 'Kanyakumari',
        cities: ['Nagercoil', 'Kanyakumari', 'Padmanabhapuram', 'Colachel', 'Thuckalay', 'Marthandam'],
      },
      {
        name: 'Karur',
        cities: ['Karur', 'Kulithalai', 'Aravakurichi', 'Pugalur', 'Krishnarayapuram'],
      },
      {
        name: 'Krishnagiri',
        cities: ['Krishnagiri', 'Hosur', 'Pochampalli', 'Uthangarai', 'Denkanikottai'],
      },
      {
        name: 'Madurai',
        cities: ['Madurai', 'Simmakkal', 'Goripalayam', 'Anna Nagar', 'KK Nagar', 'Melur', 'Usilampatti', 'Thirumangalam', 'Vadipatti'],
      },
      {
        name: 'Mayiladuthurai',
        cities: ['Mayiladuthurai', 'Sirkazhi', 'Tharangambadi', 'Kuthalam'],
      },
      {
        name: 'Nagapattinam',
        cities: ['Nagapattinam', 'Velankanni', 'Vedaranyam', 'Kilvelur', 'Thirukkuvalai'],
      },
      {
        name: 'Namakkal',
        cities: ['Namakkal', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur', 'Kolli Hills', 'Komarapalayam'],
      },
      {
        name: 'Nilgiris',
        cities: ['Udhagamandalam (Ooty)', 'Coonoor', 'Kotagiri', 'Gudalur', 'Wellington'],
      },
      {
        name: 'Perambalur',
        cities: ['Perambalur', 'Veppanthattai', 'Kunnam', 'Alathur'],
      },
      {
        name: 'Pudukkottai',
        cities: ['Pudukkottai', 'Aranthangi', 'Illuppur', 'Viralimalai', 'Alangudi', 'Gandarvakottai'],
      },
      {
        name: 'Ramanathapuram',
        cities: ['Ramanathapuram', 'Rameswaram', 'Paramakudi', 'Kilakarai', 'Tiruvadanai', 'Mudukulathur'],
      },
      {
        name: 'Ranipet',
        cities: ['Ranipet', 'Walajah', 'Arcot', 'Arakkonam', 'Nemili', 'Sholinghur'],
      },
      {
        name: 'Salem',
        cities: ['Salem', 'Attur', 'Mettur', 'Omalur', 'Edappadi', 'Sankari', 'Yercaud'],
      },
      {
        name: 'Sivaganga',
        cities: ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tiruppattur', 'Ilayangudi'],
      },
      {
        name: 'Tenkasi',
        cities: ['Tenkasi', 'Sankarankovil', 'Ambasamudram', 'Kadayanallur', 'Shenkottai', 'Alangulam'],
      },
      {
        name: 'Thanjavur',
        cities: ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Peravurani', 'Orathanadu', 'Thiruvaiyaru'],
      },
      {
        name: 'Theni',
        cities: ['Theni', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Uthamapalayam', 'Andipatti'],
      },
      {
        name: 'Thoothukudi',
        cities: ['Thoothukudi', 'Tiruchendur', 'Kovilpatti', 'Ettayapuram', 'Srivaikuntam', 'Vilathikulam'],
      },
      {
        name: 'Tiruchirappalli',
        cities: ['Tiruchirappalli', 'Srirangam', 'Thiruverumbur', 'Manapparai', 'Musiri', 'Thuraiyur', 'Lalgudi'],
      },
      {
        name: 'Tirunelveli',
        cities: ['Tirunelveli', 'Palayamkottai', 'Cheranmahadevi', 'Nanguneri', 'Radhapuram'],
      },
      {
        name: 'Tirupattur',
        cities: ['Tirupattur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Jolarpet'],
      },
      {
        name: 'Tiruppur',
        cities: ['Tiruppur', 'Avinashi', 'Dharapuram', 'Kangeyam', 'Udumalaipettai', 'Palladam'],
      },
      {
        name: 'Tiruvallur',
        cities: ['Tiruvallur', 'Avadi', 'Poonamallee', 'Ambattur', 'Ponneri', 'Gummidipoondi', 'Tiruttani'],
      },
      {
        name: 'Tiruvannamalai',
        cities: ['Tiruvannamalai', 'Arani', 'Polur', 'Chengam', 'Vandavasi', 'Cheyyar'],
      },
      {
        name: 'Tiruvarur',
        cities: ['Tiruvarur', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam', 'Kudavasal', 'Valangaiman'],
      },
      {
        name: 'Vellore',
        cities: ['Vellore', 'Katpadi', 'Gudiyattam', 'Anaicut', 'Kaniyambadi'],
      },
      {
        name: 'Viluppuram',
        cities: ['Viluppuram', 'Tindivanam', 'Gingee', 'Vanur', 'Vikravandi', 'Marakkanam'],
      },
      {
        name: 'Virudhunagar',
        cities: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Sattur', 'Aruppukkottai', 'Srivilliputhur'],
      },
    ],
  },
  {
    code: 'PY',
    name: 'Puducherry',
    districts: [
      {
        name: 'Puducherry',
        cities: ['Puducherry (White Town)', 'Lawspet', 'Muthialpet', 'Villianur', 'Oulgaret', 'Ariyankuppam', 'Bahour'],
      },
      {
        name: 'Karaikal',
        cities: ['Karaikal Town', 'Neravy', 'Nedungadu', 'Kottucherry', 'Thirunallar', 'T.R. Pattinam'],
      },
      {
        name: 'Mahe',
        cities: ['Mahe', 'Cherukallayi', 'Chalakkara', 'Pandakkal'],
      },
      {
        name: 'Yanam',
        cities: ['Yanam Town', 'Kanakalapeta', 'Mettacur', 'Agraharam', 'Guerempeta'],
      },
    ],
  },
];

export const POPULAR_HOSPITALS = [
  { name: 'Apollo Hospitals', location: 'Greams Road, Thousand Lights, Chennai', category: 'Multi-specialty' },
  { name: 'Cancer Institute (WIA)', location: 'Sardar Patel Road, Adyar, Chennai', category: 'Oncology' },
  { name: 'MIOT International', location: 'Manapakkam, Chennai', category: 'Multi-specialty & Ortho' },
  { name: 'Govt. Stanley Medical College Hospital', location: 'Old Jail Road, Royapuram, Chennai', category: 'Government & Trauma' },
  { name: 'Madras Medical Mission', location: 'Mogappair, Chennai', category: 'Cardiac' },
  { name: 'Christian Medical College (CMC)', location: 'Ida Scudder Road, Vellore', category: 'Tertiary Care' },
  { name: 'G. Kuppuswamy Naidu Memorial Hospital', location: 'P.N. Palayam, Coimbatore', category: 'Cardiac & Oncology' },
  { name: 'Meenakshi Mission Hospital', location: 'Melur Road, Madurai', category: 'Multi-specialty' },
  { name: 'JIPMER (Jawaharlal Institute)', location: 'Dhanvantari Nagar, Puducherry', category: 'Government Tertiary' },
  { name: 'Kauvery Hospital', location: 'Alwarpet, Chennai', category: 'Multi-specialty' },
];
