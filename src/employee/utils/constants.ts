import { InterviewEntity } from '../entity/interview.entity';
import { IAnswer } from '../../candidates/utils/constants';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

export enum InterviewResultColors {
  RED = 'rgba(211, 47, 47, 0.1)',
  GREEN = 'rgba(46, 125, 50, 0.1)',
  WHITE = '#FFFFFF',
}

export const CareerLevelOrder = {
  itern: 0,
  junior: 1,
  'junior+': 2,
  middle: 3,
  'middle+': 4,
  senior: 5,
  lead: 6,
};

export const SkillLevelsOrder = {
  none: 0,
  novice: 1,
  basic: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}
export interface IDeletedInterviewResponse {
  answer: string;
}
export interface ICompleteInterview {
  employeeId: string;
  levelId: string;
  positionId: string;
  answers: {
    [key: string]: string;
  };
  comment?: string;
}
export interface IEditInterviewBody extends ICompleteInterview {
  isApproved: boolean;
}

export interface ISoftSkillQuestion {
  id: string;
  value: string;
}

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}

export interface ICompleteSoftAssessmentBody {
  employeeId: string;
  positionId?: string;
  levelId?: string;
  comment?: string;
  softSkills: ISoftSkill[];
}

export interface IEditSoftAssessmentBody {
  id: string;
  employeeId: string;
  comment?: string;
  softSkills: ISoftSkill[];
}

export interface ISoftSkill {
  id: string;
  value: string;
  softSkillScoreId: string;
  comment: string;
  questions?: Array<{ id: string; value: string }>;
  soft_skill_id: { id: string; value: string };
}

export interface ISoftAssessmentResultResponse {
  assessment: SoftAssessmentEntity;
  questions: ISoftSkillQuestion[];
}

export interface ISoftAssessment {
  id: string;
  createdAt: Date;
  comment: string;
  skills: ISoftSkill[];
}

export interface ITechnology {
  id?: string;
  name: string;
}

export enum languageLevels {
  'A1',
  'A1+',
  'B1',
  'B1+',
  'B2',
  'B2+',
  'C1',
  'C2',
}

export enum languages {
  'Afar',
  'Abkhazian',
  'Afrikaans',
  'Akan',
  'Albanian',
  'Amharic',
  'Arabic',
  'Aragonese',
  'Armenian',
  'Assamese',
  'Avaric',
  'Avestan',
  'Aymara',
  'Azerbaijani',
  'Bashkir',
  'Bambara',
  'Basque',
  'Belarusian',
  'Bengali',
  'Bihari languages',
  'Bislama',
  'Tibetan',
  'Bosnian',
  'Breton',
  'Bulgarian',
  'Burmese',
  'Catalan',
  'Czech',
  'Chamorro',
  'Chechen',
  'Chinese',
  'Church Slavic',
  'Chuvash',
  'Cornish',
  'Corsican',
  'Cree',
  'Welsh',
  'Danish',
  'German',
  'Maldivian',
  'Dutch',
  'Dzongkha',
  'Greek (modern)',
  'English',
  'Esperanto',
  'Estonian',
  'Ewe',
  'Faroese',
  'Persian',
  'Fijian',
  'Finnish',
  'French',
  'Western Frisian',
  'Fulah',
  'Georgian',
  'Scottish Gaelic',
  'Irish',
  'Galician',
  'Manx',
  'Guarani',
  'Gujarati',
  'Haitian Creole',
  'Hausa',
  'Hebrew',
  'Herero',
  'Hindi',
  'Hiri Motu',
  'Croatian',
  'Hungarian',
  'Igbo',
  'Icelandic',
  'Ido',
  'Sichuan Yi',
  'Inuktitut',
  'Indonesian',
  'Inupiaq',
  'Italian',
  'Javanese',
  'Japanese',
  'Greenlandic',
  'Kannada',
  'Kashmiri',
  'Kanuri',
  'Kazakh',
  'Central Khmer',
  'Kikuyu',
  'Kinyarwanda',
  'Kyrgyz',
  'Komi',
  'Kongo',
  'Korean',
  'Kuanyama',
  'Kurdish',
  'Lao',
  'Latin',
  'Latvian',
  'Limburgan',
  'Lingala',
  'Lithuanian',
  'Luxembourgish',
  'Luba-Katanga',
  'Ganda',
  'Macedonian',
  'Marshallese',
  'Malayalam',
  'Maori',
  'Marathi',
  'Malay',
  'Malagasy',
  'Maltese',
  'Mongolian',
  'Nauru',
  'Navajo',
  'South Ndebele',
  'North Ndebele',
  'Ndonga',
  'Nepali',
  'Nynorsk, Norwegian',
  'Norwegian Bokmål',
  'Norwegian',
  'Chichewa',
  'Occitan (post 1500)',
  'Ojibwa',
  'Oriya',
  'Oromo',
  'Ossetian',
  'Panjabi',
  'Pali',
  'Polish',
  'Portuguese',
  'Pushto',
  'Quechua',
  'Romansh',
  'Romanian',
  'Rundi',
  'Russian',
  'Sango',
  'Sanskrit',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Northern Sami',
  'Samoan',
  'Shona',
  'Sindhi',
  'Somali',
  'Sotho, Southern',
  'Spanish',
  'Sardinian',
  'Serbian',
  'Swati',
  'Sundanese',
  'Swahili',
  'Swedish',
  'Tahitian',
  'Tamil',
  'Tatar',
  'Telugu',
  'Tajik',
  'Tagalog',
  'Thai',
  'Tigrinya',
  'Tonga (Tonga Islands)',
  'Tswana',
  'Tsonga',
  'Turkmen',
  'Turkish',
  'Twi',
  'Uyghur',
  'Ukrainian',
  'Urdu',
  'Uzbek',
  'Venda',
  'Vietnamese',
  'Volapük',
  'Walloon',
  'Wolof',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zhuang',
  'Zulu',
}

export const employeeNotFound = 'Employee not found!';
export const employeeCantBeSaved = 'Employee can not be saved!';

export const techAssessmentCantBeSaved =
  'Technical assessment can not be saved';
export const techAssessmentIsNotFound = 'Technical assessment is not found';
export const softSkillAssessmentNotFound = 'Soft skill assessment not found!';
export const softSkillAssessmentsNotFound = 'Soft skill assessments not found!';
export const softSkillAssessmentCantComplete =
  'Soft skill assessment cant be complete!';
export const softSkillAssessmentCantEdit =
  'Soft skill assessment cant be edit!';
export const softSkillAssessmentExist = 'Soft skill assessment already exists!';
export const positionNotFound = 'Position not found!';
export const levelNotFound = 'Level not found!';

export const projectCantBeSaved = 'Project can not be saved!';
export const projectNotFound = 'Project is not found!';
export const projectsNotFound = 'Projects are not found!';
export const cantDeleteProject = 'Can not delete project!';

export const technologyNotFound = 'Technology is not found!';

export const softSkillToCvNotFound = 'Soft skill not found!';
export const softSkillsToCvCantBeCreated = 'Soft skills can not be created';

export const descriptionMaxLength = 1024;
export const defaultMaxLength = 255;
export const levelMaxLength = 40;

export const educationNotFound = 'Education not found!';
export const educationCantBeSaved = 'Education can not be saved!';

export const languageNotFound = 'Language not found!';
export const languageCantBeSaved = 'Language can not be saved!';
export const languageOrLevelIsWrong = 'Language or level value is incorrect';
