package entity;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import exceptions.AuthenticationException;
import java.util.ArrayList;
import java.util.List;
import utils.EMF_Creator;

/**
 *
 * @author lam@cphbusiness.dk
 */
public class UserFacade {

  //Default EntityManagerFactory
//  EntityManagerFactory emf = Persistence.createEntityManagerFactory("pu");
  EntityManagerFactory emf = EMF_Creator.createEntityManagerFactory(EMF_Creator.DbSelector.DEV, EMF_Creator.Strategy.CREATE);
  private static final UserFacade instance = new UserFacade();

  private UserFacade() {
  }

  public static UserFacade getInstance() {
    return instance;
  }

  public List<String> getUsers() {
    EntityManager em = emf.createEntityManager();
    try {
      List<User> users = em.createQuery("select u from User u ").getResultList();
      List<String> userNames = new ArrayList();
      
      for(User u : users){
        userNames.add(u.getUserName());
      }
      return userNames;
    } finally {
      em.close();
    }
  }

  public User getVeryfiedUser(String username, String password) throws AuthenticationException {
    EntityManager em = emf.createEntityManager();
    User user;
    try {
      user = em.find(User.class, username);
      if (user == null || !user.verifyPassword(password)) {
        throw new AuthenticationException("Invalid user name or password");
      }
    } finally {
      em.close();
    }
    return user;
  }

}
