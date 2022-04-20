public class LeadGraphController 
{

    @AuraEnabled(cacheable = true)
    public static Map < String, Decimal > getcaseowner(String status ) {
       
        String status_val = status;
        system.debug(status_val);
            System.debug('status is not blank');
            String query ='Select Count(Owner.Id) leadCount,  Owner.Name Name from Case  where Status =  \''+  status_val +'\'  GROUP BY  Status, Owner.Name';
             Map < String, Decimal > wrapp = new Map < String, Decimal > ();
                for (AggregateResult ar: Database.query(query)) {
                     
                    wrapp.put(String.valueOf(ar.get('Name')), (Decimal) ar.get('leadCount'));
                    }
                    System.debug(status+ query + 'ffffffffffff' +wrapp);
                return wrapp;
     }
     
 }