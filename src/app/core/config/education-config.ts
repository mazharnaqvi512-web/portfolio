export interface Education {
  readonly degree: string;
  readonly institution: string;
  readonly location: string;
}

/** From the owner's resume. No dates or grades are shown because the resume gives none. */
export const EDUCATION: readonly Education[] = [
  {
    degree: 'Master of Computer Science (MCS)',
    institution: 'COMSATS University Islamabad (CUI)',
    location: 'Islamabad, Pakistan',
  },
];
