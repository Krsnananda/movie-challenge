import styled from "styled-components";
import { Searchbar, Modal } from "react-native-paper";

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
  height: 200px;
  border-radius: 10px;
`
export const Wrapper = styled.View`
  margin-top: 50%;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`
export const Column = styled.View`
  flex: .33;
  margin: 4px;
`
export const MovieNotFound = styled.Text`
  font-size: 18px;
  color: #fff;
`
export const ModalInfo = styled(Modal)`
  background-color: #151726;
  padding: 0 20px 30px 20px;
  width: 80%;
  margin: 150px 40px 0 40px;
  border-radius: 10px;
  height: 60%;
  /* align-items: center; */
`
export const Info = styled.Text`
  font-size: 16px;
  color: #fff;
  margin-top: 20px;
  text-align: center;
`
