import styled from "styled-components";
import { Searchbar } from "react-native-paper";

export const Container = styled.View`
  padding: 5%;
  margin: 100px 0;
`
export const Search = styled(Searchbar)`
  border-radius: 30px;
  border-color: #e68027;
  border-width: 2px;
  background-color: #0f111c;
`
export const EmptyLogo = styled.Image`
  width: 200px;
  height: 200px;
`
export const Poster = styled.Image`
  width: 150px;
  height: 150px;
`
export const Wrapper = styled.View`
  margin-top: 50%;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`
