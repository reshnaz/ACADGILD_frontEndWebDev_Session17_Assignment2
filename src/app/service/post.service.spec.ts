import { TestBed, inject, async, getTestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import {
  HttpTestingController, HttpClientTestingModule
} from '@angular/common/http/testing';
import {
  BaseRequestOptions, Http, XHRBackend, HttpModule,
  Response, ResponseOptions, RequestMethod
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PersonList } from './../interface/person-model';
import { FormsModule } from '@angular/forms';
import { HttpErrorHandler } from './../service/http-error-handler.service';
import { MessageService } from './../service/message.service';
import { AddPersonComponent } from './../add-person/add-person.component';
import { LoginComponent } from './../login/login.component';
import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { PersonComponent } from './../person/person.component';
import { PersonDetailComponent } from './../person-detail/person-detail.component';
import { SearchPipe } from './../pipe/search.pipe';
import { CapitalizeFirstPipe } from './../pipe/capitalize-first.pipe';
import { RouterTestingModule } from '@angular/router/testing';


describe('PostService', () => {

  var mockBackend: MockBackend;

  beforeEach(async(() => {
    // set up the test environment
    TestBed.configureTestingModule({
      declarations: [CapitalizeFirstPipe, SearchPipe, AddPersonComponent, LoginComponent, PageNotFoundComponent, PersonComponent, PersonDetailComponent],
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, FormsModule],
      providers: [PostService, HttpErrorHandler, MessageService, MockBackend, BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        }]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  // This block of code is called before each spec is executed
  beforeEach(() => {
    console.log('POST SERVICE -- This is called before spec');
  });

  it('should be created', inject([PostService], (service: PostService) => {
    expect(service).toBeTruthy();
  }));

  // This block of code compiles components
  it('should compile components', () => {
    TestBed.compileComponents();
  });

  /*   This block of code uses two person entries to check for service response
    with a mock backend connection */
  it('should check service response', () => {
    let _service: PostService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: [
                {
                  id: 1,
                  honorific: `Ms. `,
                  firstName: `Neetu`,
                  lastName: `Singh`,
                  age: 26,
                  dor: new Date('05-06-1991'),
                  personId: 354
                },
                {
                  id: 2,
                  honorific: `Mr. `,
                  firstName: `Sachin`,
                  lastName: `Shetty`,
                  age: 29,
                  dor: new Date('06-06-1988'),
                  personId: 843
                }
              ]
            }
            )));
        });

      _service = getTestBed().get(PostService);
      expect(_service).toBeDefined();
      // Using matchers to check response details
      _service.getPersons().subscribe((personList: PersonList[]) => {
        expect(personList.length).toBeDefined();
        expect(personList.length).toEqual(2);
        expect(personList.length).not.toBe(1);
      });
    });
  });

  /*   This block of code uses a person entry to check for ASYNC service response
  with a mock backend connection */
  it('should get personList async',
    async(inject([PostService], (_service: PostService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: [
                {
                  "id": 1,
                  "honorific": `Ms. `,
                  "firstName": `Garima`,
                  "lastName": `Bakshi`,
                  "age": 28,
                  "dor": new Date('07-09-1989'),
                  "personId": 643
                }]
            }
            )));
        });
      expect(_service).toBeDefined();
      // Using matchers to check response details
      _service.getPersons().subscribe(
        (response) => {
          expect(response.length).toBe(1);
          expect(response[0].firstName).toBe('Garima');
          expect(response[0].lastName).not.toBe('Sinha');
          expect(response).toEqual([{
            "id": 1,
            "honorific": `Ms. `,
            "firstName": `Garima`,
            "lastName": `Bakshi`,
            "age": 28,
            "dor": new Date('07-09-1989'),
            "personId": 643
          }]);
        });
    })));

  // Here we post values and test the content-type and status of response
  it('should insert new person/test post values',
    async(inject([PostService], (service: PostService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        connection.mockRespond(new Response(new ResponseOptions({})));
        const contentType = connection.request.headers.get('Content-Type');
        const status = connection.request.headers.get('Status');
        expect(contentType).not.toBeNull();
        expect(contentType).toEqual('application/json');
      });
      const personDetail: PersonList = {
        "id": 1,
        "honorific": `Mr. `,
        "firstName": `Pavan`,
        "lastName": `Hegde`,
        "age": 30,
        "dor": new Date('11-11-1987'),
        "personId": 283
      };
      const result = service.addPerson(personDetail);
      result.subscribe(
        (successResult) => {
          console.log(successResult)
          expect(successResult).toBeDefined();
          expect(successResult).toEqual(<PersonList>{});
        });
    })));

});
