import { sidoOptions, subjectOptions } from "./constants";

export const getSidoName = (sidoCd) => {
  const match = sidoOptions.find((sido) => sido.sidoCd === sidoCd);
  return match ? match.sidoNm : "알 수 없음";
};

export const getSubjectNm = (id) => {
  const match = sidoOptions.find((subject) => subject.id === id);
  return match ? match.value : "알 수 없음";
};