import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y
} from "swiper/modules";
// Import Swiper styles
import "swiper/css/bundle";

import {
  ActionList,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Grid,
  InlineStack,
  List,
  Page,
  Popover,
  Text,
  Thumbnail,
  Icon,
} from "@shopify/polaris";
import { BulletIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import "../global/style.css";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const theme_response = await admin.rest.resources.Theme.all({
    session: session,
  });
  const themes = theme_response.data;
  const response = await fetch(
    `http:localhost:5000/api/section/all?shop=${session.shop}`,
  );
  const json_data = await response.json();
  return json({
    themes,
    sections: json_data,
  });
};
export default function Sections() {
  const { themes, sections } = useLoaderData();
  console.log(sections);
  return (
    <>
      <Page fullWidth>
        
          <Swiper
            className="SectionSwiper"
            breakpoints={{
              576: {
                // width: 576,
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
            }}
          
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation={true}
            loop={true}
            pagination={false}
            spaceBetween={10}
            slidesPerView={3}
            onSlideChange={(e) => console.log(e,"slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {sections.map((section, index) => {
              return (
                <>
                  <SwiperSlide key={index}>
                    <SectionCard section={section} themeList={themes} />
                  </SwiperSlide>
                </>
              );
            })}
          </Swiper>
      </Page>
    </>
  );
}

function SectionCard({ themeList, section }) {
  const [actionActive, toggleAction] = useState(false);
  const [selectedTheme, setSelectTheme] = useState(null);

  const handleToggleAction = () => {
    toggleAction(!actionActive);
  };
  console.log(section, "Section");

  const items = [
    { content: "Cancel shipment", destructive: true },
    { content: "Add another shipment", disabled: true },
  ];

  const live_icon = <Icon source={BulletIcon} tone="critical" />;
  async function addsection() {}

  const theme_items = themeList.map((themeItem) => {
    if (themeItem.role == "main") {
      return {
        content: `${themeItem.name}`,
        destructive: false,
        active: selectedTheme?.id === themeItem.id ? true : false,
        prefix: live_icon,
        onAction: () => {
          setSelectTheme(themeItem);
          handleToggleAction();
        },
      };
    }
    return {
      content: themeItem.name,
      destructive: false,
      active: selectedTheme?.id === themeItem.id ? true : false,
      onAction: () => {
        setSelectTheme(themeItem);
        handleToggleAction();
      },
    };
  });

  const disclosureButtonActivator = (
    <Button
      disclosure
      accessibilityLabel="Select Theme"
      onClick={handleToggleAction}
    >
      Select Theme
    </Button>
  );

  const disclosureButton = (
    <Popover
      active={actionActive}
      activator={disclosureButtonActivator}
      onClose={handleToggleAction}
    >
      <ActionList items={theme_items} />
    </Popover>
  );
  return (
    <>
      <Card roundedAbove="sm">
        <BlockStack gap="200">
          <Text as="h2" variant="headingSm">
            {section.name}
          </Text>
          <BlockStack gap="200">
            <img
              src="https://cdn.shopify.com/s/files/1/0611/8067/4224/files/banner_section.png?v=1723977756"
              alt="gap"
            />
          </BlockStack>
          <InlineStack align="space-between">
            {selectedTheme ? (
              <>
                {selectedTheme.name}
                <Button onClick={() => addsection()}>Add section</Button>
              </>
            ) : (
              <div>Please Select a Theme</div>
            )}
            <ButtonGroup align="end">{disclosureButton}</ButtonGroup>
          </InlineStack>
        </BlockStack>
      </Card>
    </>
  );
}
