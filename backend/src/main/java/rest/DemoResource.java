package rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entity.User;
import entity.UserFacade;
import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * REST Web Service
 *
 * @author lam@cphbusiness.dk
 */
@Path("info")
public class DemoResource {

    @Context
    private UriInfo context;
    
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    
    @Context
    SecurityContext securityContext;

    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("user")
    @RolesAllowed({"User","user"})
    public String getFromUser(){
        String user = securityContext.getUserPrincipal().getName();
        return "\"This message if from the server (requires the user role): Hello from USER: "+ user+"\"";
       // return "{\"msg\":\"This message if from the server (requires the user role): Hello from USER: "+user+"\"}";
//        System.out.println("{\"msg\":\"This message if from the server (requires the user role): Hello from USER: "+user+"\"}");
//        return "[]";
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("admin")
    @RolesAllowed({"Admin","admin"})
    public String getFromAdmin() {
        String admin = securityContext.getUserPrincipal().getName();
        return "\"This message if from the server (requires the admin role):Hello from ADMIN: "+ admin+"\"";
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("admin/users")
     @RolesAllowed({"Admin","admin"})
    public String getUsers() {
        //String admin = securityContext.getUserPrincipal().getName();
        List<String> users = UserFacade.getInstance().getUsers();
        return gson.toJson(users);
    }
}
