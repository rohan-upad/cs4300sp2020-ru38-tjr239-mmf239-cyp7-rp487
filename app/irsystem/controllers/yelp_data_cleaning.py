#!/usr/bin/env python
# coding: utf-8

# In[1]:


import nltk
import numpy as np
import pandas as pd
from nltk.corpus import stopwords

addl_stopwords_file = open("./stoplist.txt", "r")
addl_stopwords = addl_stopwords_file.read()
addl_stopwords_list = addl_stopwords.split("\n")
addl_stopwords_file.close()
# print(addl_stopwords_list)
pos_sent_file = open("./positive_words_en.txt", "r")
pos_sent = pos_sent_file.read()
pos_sent_list = pos_sent.split("\n")
pos_sent_file.close()
# print(pos_sent_list)
neg_sent_file = open("./negative_words_en.txt", "r")
neg_sent = neg_sent_file.read()
neg_sent_list = neg_sent.split("\n")
neg_sent_file.close()
# print(neg_sent_list)
# pull in nltk stopwords as set and create a regex to filter by
stop_words = set(stopwords.words("english"))
addl_stop_words = set(addl_stopwords_list)
pos_sent_words = set(pos_sent_list)
neg_sent_words = set(neg_sent_list)
lex = stop_words | addl_stop_words | pos_sent_words | neg_sent_words
reg_expr = r'\b(?:{})\b'.format('|'.join(lex))


# In[117]:


yelp_bus_file_name = "./yelp_academic_dataset_business.json"
yelp_rev_file_name = "./yelp_academic_dataset_review.json"

# reads in 1 mil reviews, cleans them by removing stopwords, words with less than 3 chars, and converts to lowercase


def yelp_data_cleaning(businesses_file_name, reviews_file_name):
    businesses = pd.read_json(businesses_file_name,
                              lines=True, orient='columns', chunksize=1000000)
    reviews = pd.read_json(reviews_file_name, lines=True,
                           orient='columns', chunksize=1000000)
    # since big files, read_json returns an iterator so we simply take the first "chunk" which is 1 mil entries
    for business in businesses:
        subset_business = business
        break

    for review in reviews:
        subset_review = review
        break
    # join review and business datasets by business_id column
    df_review = subset_review[['user_id',
                               'business_id', 'stars', 'date', 'text']]
    restaurants = subset_business[subset_business['categories'].str.contains(
        'Restaurant.*|Cafe.*|Food.*', regex=True) == True].reset_index()
    df_business = restaurants[['business_id', 'name', 'address']]
    combined_business_df = df_review.merge(
        df_business, how='right', on='business_id')
    print(combined_business_df.shape)

    #stop_words = set(stopwords.words("english"))
    #addl_stop_words = set(addl_stopwords_list)
    #pos_sent_words = set(pos_sent_list)
    #neg_sent_words = set(neg_sent_list)
    #reg_expr = r'\b(?:{})\b'.format('|'.join(lex))
    series_data = pd.Series(combined_business_df['text'])

    # remove special characters
    series_data = series_data.str.replace('[^a-zA-Z#]', ' ')
    # remove words that are 1 or 2 letters
    series_data = series_data.str.replace(r'\b\w{1,2}\b', '')
    # remove stopwords
    series_data = series_data.str.replace(reg_expr, '')
    # make everything lowercase
    series_data = series_data.str.lower()
    combined_business_df['clean_text'] = series_data
    # return only dataframe with cleaned text
    combined_business_clean_df = combined_business_df[[
        'user_id', 'business_id', 'stars', 'date', 'clean_text', 'name', 'address']]
    # export new, cleaned dataframe to csv
    combined_business_clean_df.to_csv(
        'clean_yelp_rest_reviews_new.csv', index=False)


# In[118]:


yelp_data_cleaning(yelp_bus_file_name, yelp_rev_file_name)


# In[ ]:
