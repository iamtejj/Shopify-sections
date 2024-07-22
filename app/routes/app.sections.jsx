import { Button } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({request}) =>{
    const { admin, session } = await authenticate.admin(request);
    const theme_response = await admin.rest.resources.Theme.all({
        session: session,
      });
    const themes = theme_response.data
  
    return json(
        {
            themes
        }
    );
}
export default function Sections(){
    const {themes} = useLoaderData();
    console.log(themes)
    return(
        <>
            <h1>sections</h1>
            <Button>Add section to theme</Button>
        </>
    )
}