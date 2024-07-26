
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { promises as fs } from "fs";
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

} from '@shopify/polaris';
import {
  BulletIcon
} from '@shopify/polaris-icons';
import { useState } from "react";


export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const theme_response = await admin.rest.resources.Theme.all({
    session: session,
  });
  const themes = theme_response.data;
  const url = new URL(request.url);
  const response = await fetch(`${url.origin}/api/readfile`);
  console.log("section response")
  const data = await response.json();
  console.log(data)
  // console.log("server data");
  // console.log(data);
  // const section_directory =   __dirname;
  // console.log("directory name")
  // console.log(section_directory)
  
  return json(
    {
      themes
    }
  );
}
export default function Sections() {
  const { themes } = useLoaderData();
  console.log(themes)
  return (
    <>
     <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 4}}>
          <SectionCard themeList={themes} />
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 4}}>
          <SectionCard themeList={themes} />
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 4}}>
          <SectionCard themeList={themes} />
        </Grid.Cell>
      </Grid>

     </Page>
      
    </>
  )
}

function SectionCard({themeList}) {
  const [actionActive, toggleAction] = useState(false);
  const [selectedTheme,setSelectTheme] = useState(null)

  const handleToggleAction = () => {
    toggleAction(!actionActive);
  };

  const items = [
    { content: 'Cancel shipment', destructive: true },
    { content: 'Add another shipment', disabled: true },
  ];

  const live_icon = <Icon
  source={BulletIcon}
  tone="critical"
/>
  async function addsection(){
   
  }

  const theme_items = themeList.map((themeItem)=>{
    if(themeItem.role == "main"){
      return {
        content:`${themeItem.name}`,
        destructive:false,
        active:selectedTheme?.id === themeItem.id ? true :false,
        prefix:live_icon,
        onAction:(()=>{
          setSelectTheme(themeItem);
          handleToggleAction()
        })
      }
    }
    return {
      content:themeItem.name,
      destructive:false,
      active:selectedTheme?.id === themeItem.id ?true:false,
      onAction:(()=>{
        setSelectTheme(themeItem);
        handleToggleAction()
      })
    }
  })

  

  const disclosureButtonActivator = (
    <Button disclosure accessibilityLabel="Select Theme" onClick={handleToggleAction}>
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
            Demo section
          </Text>
          <BlockStack gap="200">
          <Thumbnail
            source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
            alt="Black choker necklace"
          />
          </BlockStack>
          <InlineStack align="space-between">
            {selectedTheme ?
              (
                <>
                {selectedTheme.name}
                <Button onClick={()=>addsection()}>Add section</Button>
                </>
              )
             :<div>Please Select a Theme</div>
             }
            <ButtonGroup align="end">
              {disclosureButton}
            </ButtonGroup>
          </InlineStack>
        </BlockStack>
      </Card>
    </>
  )
}

