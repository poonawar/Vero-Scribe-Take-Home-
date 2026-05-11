/*
 Central management for the entire app.
 */

import { createContext, useContext, useReducer } from "react";
import { physicians, allSlots } from "../data/mockData";

const AppContext = createContext(null);

/*Initial state: loaded from mock data at startup.
 
 */
const initialState = {
  physicians,
  slots: allSlots,
  bookings: [],
  view: "patient",  //controls which top-level view renders: 'patient' or 'admin'
  nextBookingId: 1, //increment
};

function reducer(state, action) {
  switch (action.type) {

    case "SET_VIEW":
      return { ...state, view: action.payload };

    case "CREATE_BOOKING": {
      const { slotId, patientInfo } = action.payload;
      const newBooking = {
        id: `BK-${String(state.nextBookingId).padStart(4, "0")}`,
        slotId,
        patientInfo,
        status: "pending", //all bookings start as pending since the admin/physician must confirm
        createdAt: new Date().toISOString(),
      };

      const updatedSlots = state.slots.map((s) =>
        s.id === slotId ? { ...s, booked: true } : s
      );

      return {
        ...state,
        bookings: [...state.bookings, newBooking],
        slots: updatedSlots,
        nextBookingId: state.nextBookingId + 1,
      };
    }

    /*UPDATE_BOOKING_STATUS is used by the admin dashboard to confirm or cancel.
    
     */
    case "UPDATE_BOOKING_STATUS": {
      const { bookingId, status } = action.payload;
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status } : b
        ),
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
