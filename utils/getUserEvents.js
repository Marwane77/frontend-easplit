import { PATH } from "./path";

export const getUserEvents = async (token) => {
  const response = await fetch(`${PATH}/events/user-events/${token}`);
  const eventsList = await response.json();
  if (eventsList.result) {
    return eventsList.events;
  }
  //console.log(eventsList.events);
};
