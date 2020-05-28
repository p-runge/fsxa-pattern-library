import { CreateElement } from "vue";
import WelcomeSection from "@/components/Section/components/WelcomeSection";
import InterestingFactsSection from "@/components/Section/components/InterestingFactsSection";
import createStore from "@/store";

export default {
  title: "Sections"
};

const store = createStore({
  apiKey: "f5a14f78-d8b8-4525-a814-63b49e0436ee",
  caas:
    "https://caas.staging.delivery-platform.e-spirit.live/0b975076-5061-44e6-bbce-c1d9f73f6606/preview.content",
  navigationService:
    "https://do-caas-core02.navigation.prod.delivery-platform.e-spirit.live/navigation/preview.0b975076-5061-44e6-bbce-c1d9f73f6606",
  locale: "de_DE"
});
export const welcome = () => ({
  store,
  // eslint-disable-next-line
  render: (h: CreateElement) => (
    <WelcomeSection
      payload={{
        st_headline: `<div data-fs-style="format.standard">YOUR <div data-fs-style=format.span_yellow_text">INDIVIDUAL</div> HOME</div>`,
        st_jumbo_headline: `Smart Living`,
        st_kicker: "Welcome!!!",
        st_text: `<div data-fs-style="format.standard">With simple functions and tools, our Smart Living customers can create their own individual home. From light control to central media control.</div>`,
        st_picture: {
          previewId: "lkjhgfhjklö",
          src:
            "https://enterprisedev.e-spirit.cloud/media/media/images/Content/Controlpanel-on-a-tablet.jpeg"
        }
      }}
    />
  )
});

export const interestingFacts = () => ({
  store,
  // eslint-disable-next-line
  render: (h: CreateElement) => (
    <InterestingFactsSection
      payload={{
        st_background_image: {
          previewId:
            "eyJkYXRhLWZzLWF0dHJzIjoiZXlKc1lXNW5kV0ZuWlVGaVluSmxkbWxoZEdsdmJpSTZJa1JGSW4wPSIsImRhdGEtZnMtaWQiOiJleUpwWkNJNk5UY3lOemtzSW5OMGIzSmxJam9pVFVWRVNVRlRWRTlTUlNKOSJ9",
          src:
            "https://enterprisedev.e-spirit.cloud/smartliving/media/images/Content/Smarthome-panel-left_interesting_facts_banner.jpg"
        },
        st_counters: [
          {
            previewId: "70b14ca5-84aa-4bc8-9769-f38d7ecd50c7.de",
            identifier: "70b14ca5-84aa-4bc8-9769-f38d7ecd50c7",
            data: {
              st_number: 10,
              st_text: "Individuelle Produkte"
            }
          },
          {
            previewId: "574f0440-3060-4ed8-9167-622cdf7d626a.de",
            identifier: "574f0440-3060-4ed8-9167-622cdf7d626a",
            data: { st_number: 180, st_text: "Mitarbeiter" }
          },
          {
            previewId: "5640dc8a-f612-47c9-b7ab-9ce9bc0b7029.de",
            identifier: "5640dc8a-f612-47c9-b7ab-9ce9bc0b7029",
            data: { st_number: 3200, st_text: "Fachhändler" }
          }
        ],
        st_headline: "Smart Living",
        st_tagline: "WER WIR SIND",
        st_text:
          '<div data-fs-style="format.standard"><b>SMART LIVING</b> ist ein weltweit führender Anbieter für Smart Home Lösungen sowohl für private Haushalte als auch für umfassende Unternehmenslösungen. Seit 2014 haben wir viele smarte Projekte mit namenhaften Partnern im nationalen und internationalen Bereich durchgeführt.</div>'
      }}
    />
  )
});
