import { sidoOptions } from "./constants";

export const getSidoName = (sidoCd) => {
  const match = sidoOptions.find((sido) => sido.sidoCd === sidoCd);
  return match ? match.sidoNm : "알 수 없음";
};