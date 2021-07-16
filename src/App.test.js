import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./components/App";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("https://api.flickr.com/services/rest/", (req, res, ctx) => {
    return res(
      ctx.json({
        photos: {
          page: 1,
          pages: 50,
          perpage: 20,
          total: 1000,
          photo: [
            {
              id: "51314388292",
              owner: "193298054@N03",
              secret: "c1d53f756e",
              server: "65535",
              farm: 66,
              title: "",
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
              description: { _content: "" },
              ownername: "hongsonbvdh",
              tags: "",
              url_o:
                "https://live.staticflickr.com/65535/51314388292_76853f8e40_o.jpg",
              height_o: 1110,
              width_o: 1013,
              url_m:
                "https://live.staticflickr.com/65535/51314388292_c1d53f756e.jpg",
              height_m: 500,
              width_m: 456,
              pathalias: null,
            },
            {
              id: "51314388337",
              owner: "190930881@N02",
              secret: "c83dd575ec",
              server: "65535",
              farm: 66,
              title: "Tusk\u00f3k",
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
              description: { _content: "" },
              ownername: "kolozsvarigabor11",
              tags: "",
              url_o:
                "https://live.staticflickr.com/65535/51314388337_8ebc0f0525_o.jpg",
              height_o: 3841,
              width_o: 2832,
              url_m:
                "https://live.staticflickr.com/65535/51314388337_c83dd575ec.jpg",
              height_m: 500,
              width_m: 369,
              pathalias: null,
            },
            {
              id: "51314388917",
              owner: "149635677@N08",
              secret: "7186c6e3e2",
              server: "65535",
              farm: 66,
              title: "AMG GTS",
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
              description: { _content: "" },
              ownername: "ollyolly1",
              tags: "",
              url_o:
                "https://live.staticflickr.com/65535/51314388917_b158bf4917_o.jpg",
              height_o: 3024,
              width_o: 4032,
              url_m:
                "https://live.staticflickr.com/65535/51314388917_7186c6e3e2.jpg",
              height_m: 375,
              width_m: 500,
              pathalias: null,
            },
            {
              id: "51314389872",
              owner: "9472244@N02",
              secret: "00571ef55c",
              server: "65535",
              farm: 66,
              title: "20130122-0000  -20130122-6073",
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
              description: { _content: "" },
              ownername: "AridAcres",
              tags: "amshockey istperiodamsvssea",
              url_m:
                "https://live.staticflickr.com/65535/51314389872_00571ef55c.jpg",
              height_m: 333,
              width_m: 500,
              pathalias: null,
            },
          ],
        },
        stat: "ok",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Latest photos at the beginning", async () => {

  render(<App />);
  await waitFor(() => {
    expect(screen.getAllByText(/tags/i)[0]).toBeInTheDocument();
  });
  
});

test("show no results message", async () => {

  server.use(
    rest.get("https://api.flickr.com/services/rest/", (req, res, ctx) => {
      return res(
        ctx.json({
          photos: { page: 1, pages: 0, perpage: 20, total: 0, photo: [] },
          stat: "ok",
        })
      );
    })
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("There is no results")).toBeInTheDocument();
  });

});

test("Change search type", async () => {

  render(<App />);
  fireEvent.click(screen.getByAltText("Search by text"));
  expect(screen.getByAltText("Search by tag")).toBeInTheDocument();

});
