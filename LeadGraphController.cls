public class LeadGraphController 
{
@AuraEnabled(cacheable = true)
    public static List<DataSet> getLeadByStatus(String status ,string Users ) {
        String status_val = status;
        system.debug(status_val);
         String query ='Select Count(Owner.Id) leadCount,  Owner.Name Name from Case  where Status =  \''+  status_val +'\'  GROUP BY  Status, Owner.Name LIMIT ' + Users + '';
                List<DataSet> dataSet = new List<DataSet>();
                for(AggregateResult ar: Database.query(query)){
                String statuss =  (String)ar.get('Name') ;
                Integer total =(Integer)ar.get('leadCount');
                dataSet.add(new DataSet(statuss ,total));
                }
                System.debug('dataSet'+dataSet);
                return dataSet ;
                }
                public class DataSet
                {
                public DataSet(String label ,Integer count){
                this.label  = label ;
                this.count = count ;
                }
                @AuraEnabled
                public String label {get;set;}
                @AuraEnabled
                public Integer  count {get;set;}
      }
    
        }