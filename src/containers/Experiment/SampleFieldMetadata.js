/**
 * Description for each one of the fields for Samples
 */
const SampleFieldMetadata = [
  {
    Header: 'Title',
    id: 'title',
    accessor: d => d.title,
    minWidth: 180
  },
  {
    Header: 'Accession Code',
    id: 'accession_code',
    accessor: d => d.accession_code,
    minWidth: 160
  },
  {
    Header: 'Sex',
    id: 'sex',
    accessor: d => d.sex,
    minWidth: 160
  },
  {
    Header: 'Age',
    id: 'age',
    accessor: d => d.age,
    minWidth: 160
  },
  {
    Header: 'Specimen Part',
    id: 'specimen_part',
    accessor: d => d.specimen_part,
    minWidth: 160
  },
  {
    Header: 'Genotype',
    id: 'genotype',
    accessor: d => d.genotype,
    minWidth: 160
  },
  {
    Header: 'Disease',
    id: 'disease',
    accessor: d => d.disease,
    minWidth: 160
  },
  {
    Header: 'Disease Stage',
    id: 'disease_stage',
    accessor: d => d.disease_stage,
    minWidth: 160
  },
  {
    Header: 'Cell Line',
    id: 'cell_line',
    accessor: d => d.cell_line,
    minWidth: 160
  },
  {
    Header: 'Treatment',
    id: 'treatment',
    accessor: d => d.treatment,
    minWidth: 160
  },
  {
    Header: 'Race',
    id: 'race',
    accessor: d => d.race,
    minWidth: 160
  },
  {
    Header: 'Subject',
    id: 'subject',
    accessor: d => d.subject,
    minWidth: 160
  },
  {
    Header: 'Compound',
    id: 'compound',
    accessor: d => d.compound,
    minWidth: 160
  },
  {
    Header: 'Time',
    id: 'time',
    accessor: d => d.time,
    minWidth: 160
  }
];

SampleFieldMetadata.forEach((x, index) => (x.index = index));

export default SampleFieldMetadata;
