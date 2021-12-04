import styled from "styled-components";
import { Searchbar } from "react-native-paper";

export const Container = styled.View`
  justify-content: center;
  align-items: center;
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
export const Wrapper = styled.View`
  margin-top: 50%;
`
